"""builds favicon.svg: the letters in mr de haviland, drawn as vector outlines
(so no font is needed to render — browsers strip web fonts from svg favicons),
with a faint fir behind them, same 3-column shape as the hero tree.

run it:
    python tools/make-favicon.py            -> writes favicon.svg
    python tools/make-favicon.py --preview  -> also writes favicon-preview.png (needs pillow)

needs: fontTools. pillow only if you want the preview.
tweak the constants below to change the letters, colors, or how faint the tree is.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

# ---- stuff you can tweak ----
LETTERS     = "BG"            # what the icon says
FONT_PATH   = "assets/fonts/mrdehaviland.ttf"
TILE_COLOR  = "#55493A"       # the rounded background tile
TEXT_COLOR  = "#F3EBDA"       # the letters
FIR_COLOR   = "#A68DA6"       # dusty purple tree
FIR_OPACITY = 0.12            # lower = more see-through
OUT         = "assets/favicon.svg"

# the hero fir's tiers, straight from style.css: (top, width, height) per crown
CROWNS = [(18,34,8),(66,61,11),(116,71,13),(165,84,15),(214,100,18),
          (256,116,21),(304,136,25),(357,160,28),(426,190,34),(514,222,40)]
COLS   = [(106,58),(292,10),(478,55)]   # three columns: (x-center, top-offset)

def hex_rgb(h):
    h=h.lstrip("#"); return tuple(int(h[i:i+2],16) for i in (0,2,4))

# turn the letters into svg outline paths + figure out the size/position to center them
def letters_group():
    f=TTFont(FONT_PATH); upm=f['head'].unitsPerEm
    cmap=f.getBestCmap(); glyf=f['glyf']; hmtx=f['hmtx']; gs=f.getGlyphSet()
    items=[]; pen=0; x0=y0=1e9; x1=y1=-1e9
    for ch in LETTERS:
        gn=cmap[ord(ch)]; g=glyf[gn]; adv=hmtx[gn][0]
        p=SVGPathPen(gs); gs[gn].draw(p)              # the glyph outline, in font units
        items.append((p.getCommands(), pen))
        if g.numberOfContours:                         # skip blanks like space
            x0=min(x0,pen+g.xMin); x1=max(x1,pen+g.xMax)
            y0=min(y0,g.yMin);     y1=max(y1,g.yMax)
        pen+=adv
    F=min(23.0*upm/(x1-x0), 20.0*upm/(y1-y0)); s=F/upm   # size that fits the letters
    penx=16-(x0+x1)/2*s                                  # center the ink at x=16
    base=16+(y0+y1)/2*s                                  # center the ink at y=16
    # one group: move to the baseline, scale down, flip y (font y is up, svg y is down)
    paths="".join(f'<path d="{d}" transform="translate({off},0)"/>' for d,off in items)
    return f'<g transform="translate({penx:.3f},{base:.3f}) scale({s:.5f},{-s:.5f})" fill="{TEXT_COLOR}">{paths}</g>'

# build the fir: every crown of every column, plus a map into the 32x32 tile
def build_fir():
    doms=[]; xs=[]; ys=[]
    for cx,wt in COLS:
        for (t,w,h) in CROWNS:
            top=wt+t; doms.append((cx,top,w,h))
            xs+=[cx-w/2,cx+w/2]; ys+=[top,top+h]
    xs+=[292]; ys+=[10,700]                       # include the trunk span
    X0,X1,Y0,Y1=min(xs),max(xs),min(ys),max(ys)
    cx=(X0+X1)/2; cy=(Y0+Y1)/2
    sc=26.0/max(X1-X0,Y1-Y0)                       # shrink the whole tree to ~26px
    MX=lambda x:16+(x-cx)*sc; MY=lambda y:16+(y-cy)*sc
    return doms,MX,MY,sc

def dome(cx,top,w,h,MX,MY):                        # flat top, rounded bottom (one tier)
    l,r,m=MX(cx-w/2),MX(cx+w/2),MX(cx); t,b=MY(top),MY(top+h)
    return f'M{l:.2f} {t:.2f} Q{l:.2f} {b:.2f} {m:.2f} {b:.2f} Q{r:.2f} {b:.2f} {r:.2f} {t:.2f} Z'

def main():
    doms,MX,MY,sc=build_fir()
    firpaths="".join(f'<path d="{dome(*d,MX,MY)}"/>' for d in doms)
    trunk=f'<rect x="{MX(290):.2f}" y="{MY(12):.2f}" width="{4*sc:.2f}" height="{(700-12)*sc:.2f}"/>'
    letters=letters_group()

    svg=f'''<!-- tab icon: "{LETTERS}" in mr de haviland drawn as outlines (no font needed), faint 3-column fir behind it -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <clipPath id="tile"><rect width="32" height="32" rx="7"/></clipPath>
  <g clip-path="url(#tile)">
    <rect width="32" height="32" fill="{TILE_COLOR}"/>
    <g fill="{FIR_COLOR}" opacity="{FIR_OPACITY}">{trunk}{firpaths}</g>
    {letters}
  </g>
</svg>
'''
    open(OUT,"w",encoding="utf-8").write(svg)
    print("wrote",OUT)

    if "--preview" in sys.argv:                    # optional big png so you can eyeball it
        from PIL import Image, ImageDraw, ImageFont
        S=12; im=Image.new("RGBA",(32*S,32*S),(0,0,0,0)); d=ImageDraw.Draw(im)
        d.rounded_rectangle([0,0,32*S-1,32*S-1],radius=7*S,fill=hex_rgb(TILE_COLOR)+(255,))
        fl=Image.new("RGBA",im.size,(0,0,0,0)); fd=ImageDraw.Draw(fl)
        a=int(FIR_OPACITY*255); fc=hex_rgb(FIR_COLOR)+(a,)
        fd.rectangle([MX(290)*S,MY(12)*S,MX(294)*S,MY(700)*S],fill=fc)
        for (cx,top,w,h) in doms:
            fd.chord([MX(cx-w/2)*S,(MY(top)-(MY(top+h)-MY(top)))*S,MX(cx+w/2)*S,MY(top+h)*S],0,180,fill=fc)
        im=Image.alpha_composite(im,fl); d=ImageDraw.Draw(im)
        fnt=ImageFont.truetype(FONT_PATH,int(16*S*0.9))
        bb=d.textbbox((0,0),LETTERS,font=fnt); cx=(bb[0]+bb[2])/2; cy=(bb[1]+bb[3])/2
        d.text((16*S-cx,16*S-cy),LETTERS,font=fnt,fill=hex_rgb(TEXT_COLOR)+(255,))
        im.save("favicon-preview.png"); print("wrote favicon-preview.png")

if __name__=="__main__":
    main()
