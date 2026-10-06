// all the js for the home page. runs after the html loads (script tag is at the end of the body).

// the projects shown in the "work" section.
// each one: cat = category, t = title, img = thumbnail (null = none),
// url = page it opens, d = one-liner, status = the little tag. edit/reorder freely.
var projects = [
  {cat:"Interface / Instrument", t:"Pan-Tilt Gimbal Console", img:"images/GimbalConsole.png",
   url:"projects/gimbal-console.html",
   d:"A two-axis camera console with live attitude instruments, drawn from scratch in PyQt6.",
   status:"Live demo"},
  {cat:"Interface / Instrument", t:"Zaber Motion Stage", img:"images/ZaberStageController.png",
   url:"projects/zaber-stage-controller.html",
   d:"A control panel for linear and rotary motion stages, wired to a software simulator.",
   status:"Live demo"},
  {cat:"Interface / Instrument", t:"Picoammeter Readout", img:"images/PicoammeterReadout.png",
   url:"projects/picoammeter-readout.html",
   d:"An operator panel for a low-current measurement setup, with a large live readout.",
   status:"Live demo"},
  {cat:"Telemetry", t:"MSP430 Telemetry Dashboard", img:"images/msp430-dashboard.gif",
   url:"projects/msp430-telemetry-dashboard.html",
   d:"C firmware streams live readings over UART to a Python service and a web dashboard.",
   status:"Live demo"},
  {cat:"AI / ML", t:"OCR System", img:"images/OcrDemo.png",
   url:"projects/ocr.html",
   d:"Industrial label OCR with 360° rotation scanning, error correction, and validation.",
   status:"Live demo"},
  {cat:"UX / UI", t:"Figma Self-Taught Project", img:"images/figma3.PNG",
   url:"projects/figma-self-taught.html",
   d:"I taught myself Figma by designing a full multi-page app for a small business.",
   status:"Project"},
  {cat:"AI / ML", t:"Real-Time Anomaly Detection", img:null,
   url:"projects/anomaly-detection.html",
   d:"A convolutional autoencoder that flags frames by reconstruction error on edge hardware.",
   status:"View project"},
  {cat:"Robotics", t:"AGV Control Interface", img:null,
   url:"projects/agv-interface.html",
   d:"An operator interface for a fleet of AGVs, with PLC ladder-logic interlocks.",
   status:"View project"},
  {cat:"Hardware", t:"Mass Spectrometer Interface", img:null,
   url:"projects/mass-spectrometer.html",
   d:"A GUI for a mass spectrometer, with a live spectral plot and serial instrument control.",
   status:"View project"},
  {cat:"Embedded & Controls", t:"SmartMotor Mixing Device", img:null,
   url:"projects/smartmotor-mixer.html",
   d:"A Moog Animatics SmartMotor driven in torque mode with tuned ramp profiles.",
   status:"View project"},
  {cat:"Hardware", t:"Calorimeter Heating System", img:null,
   url:"projects/calorimeter.html",
   d:"An interface for a calorimeter, with live temperature control and data logging.",
   status:"View project"},
  {cat:"Frontend", t:"IR Facial Recognition", img:null,
   url:"projects/ir-facial-recognition.html",
   d:"My senior capstone: an IR camera recognition pipeline with a real-time web interface.",
   status:"View project"},
  {cat:"Personal", t:"Women's Health Tracker", img:null,
   url:"projects/womens-health-tracker.html",
   d:"A health tracker built around the female cycle, with phase-aware insights.",
   status:"View project"},
  {cat:"Personal", t:"Thread Jutsu Order Tracker", img:null,
   url:"projects/etsy-order-tracker.html",
   d:"A shared-inventory tracker that keeps stock in sync across multiple listings.",
   status:"View project"},
  {cat:"Personal", t:"This Site!", img:null,
   url:"https://github.com/bg1750/bellagallo",
   d:"A living record of what I am learning, built from scratch as I go.",
   status:"Source on GitHub"},
];

// build a card for every project and drop it into the page
var list = document.getElementById("workList");   // the empty box in the html
projects.forEach(function(p){                      // p = one project
  var card = document.createElement("a");          // the card is a clickable link
  card.className = "work-card reveal" + (p.img ? "" : " noimg");  // "noimg" when there's no picture
  card.href = p.url;                               // where it goes on click
  if(p.url.indexOf("http") === 0){                 // outside link?
    card.target = "_blank";                        // open in a new tab
    card.rel = "noopener";                         // link out safely
  }
  var imgPart = p.img ? '<div class="wc-img"><img src="'+p.img+'" alt=""></div>' : "";  // image box or nothing
  card.innerHTML =                                 // the card's insides
    imgPart +
    '<div class="wc-body">' +
      '<span class="wc-cat">'+p.cat+'</span>' +    // category
      '<h3>'+p.t+'</h3>' +                         // title
      '<p>'+p.d+'</p>' +                           // description
      '<div class="wc-foot">' +
        '<span class="wc-status">'+p.status+'</span>' +  // status tag
        '<span class="wc-view">Open →</span>' +    // little hint
      '</div>' +
    '</div>';
  list.appendChild(card);                          // add it to the page
});

// fade things in as you scroll to them
var obs = new IntersectionObserver(function(entries){  // watches for stuff entering the screen
  entries.forEach(function(e){
    if(e.isIntersecting){                          // on screen now?
      e.target.classList.add("in");                // add "in" so css fades it in
      obs.unobserve(e.target);                     // only fade once
    }
  });
}, {threshold:0.12});                              // fire at ~12% visible
document.querySelectorAll(".reveal").forEach(function(el){ obs.observe(el); });  // watch everything marked ".reveal"

// soft ethereal sound when a hero button is clicked
var openSound = new Audio("soundFX/ethereal-ambience-loop-danijel-zambo-1-1-00-05.mp3");  // the sound file
openSound.volume = 0.35;                           // keep it gentle
var heroBtns = document.querySelectorAll(".btn.solid, .btn.ghost");  // both hero buttons
heroBtns.forEach(function(btn){
  btn.addEventListener("click", function(){
    openSound.currentTime = 0;                     // rewind to the start
    openSound.play();                              // play (the click lets the browser allow it)
  });                                              // the page still scrolls to its link as normal
});

// remember your spot in the list after visiting a project
window.addEventListener("pagehide", function(){    // runs when we leave the page
  sessionStorage.setItem("bgWorkScrollY", String(window.scrollY));  // save how far down we were
});
function restoreWorkScroll(){                      // jump back to where we were
  if(location.hash !== "#work") return;            // only when a project's "back" link brings us here
  var y = sessionStorage.getItem("bgWorkScrollY"); // the saved spot
  if(y === null) return;                           // nothing saved? skip
  var root = document.documentElement, prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";              // no smooth animation on the jump
  window.scrollTo(0, parseInt(y, 10) || 0);        // jump back
  root.style.scrollBehavior = prev;                // restore the smooth-scroll setting
}
// wait for the browser's own jump to #work, then override it with our saved spot
window.addEventListener("DOMContentLoaded", function(){
  requestAnimationFrame(function(){ requestAnimationFrame(restoreWorkScroll); });
});
