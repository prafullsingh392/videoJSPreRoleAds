// Dependencies
import videojs from "video.js";
import "videojs-contrib-ads";
import "videojs-ima";

// Styles
import "video.js/dist/video-js.min.css";
import "videojs-contrib-ads/dist/videojs-contrib-ads.css";
import "videojs-ima/src/css/videojs.ima.css";

// Video tag => Video.js object
var player = videojs("content_video");

// VAST files only, VMAP is not available
// Bumper ad uses mediafiles from "postroll"
const prerollAdTag =
  "http://pubads.g.doubleclick.net/gampad/ads?slotname=/124319096/external/ad_rule_samples&sz=640x480&ciu_szs=300x250&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&url=&unviewed_position_start=1&output=xml_vast3&impl=s&env=vp&gdfp_req=1&ad_rule=0&vad_type=linear&vpos=preroll&pod=1&ppos=1&lip=true&min_ad_duration=0&max_ad_duration=30000&vrid=6376&cmsid=496&video_doc_id=short_onecue&kfa=0&tfcd=0";
const bumperAdTag =
  "http://pubads.g.doubleclick.net/gampad/ads?slotname=/124319096/external/ad_rule_samples&sz=640x480&ciu_szs=300x250&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&url=&unviewed_position_start=1&output=xml_vast3&impl=s&env=vp&gdfp_req=1&ad_rule=0&vad_type=linear&vpos=postroll&pod=3&ppos=1&lip=true&min_ad_duration=0&max_ad_duration=30000&vrid=6376&cmsid=496&video_doc_id=short_onecue&kfa=0&tfcd=0";

// Helpers
function playPreroll() {
  console.log("playing preroll...");
  player.ima.changeAdTag(prerollAdTag);
  player.ima.requestAds();
}

let playedBumper = false;
function playBumper() {
  console.log("playing bumper...");
  player.ima.changeAdTag(bumperAdTag);
  player.ima.requestAds();
  playedBumper = true;
}

// Initializing IMA
player.ima({
  debug: true,
  id: "content_video",

  // Some unrelated(?) configs
  disableFlashAds: true,
  showCountdown: false,
  showControlsForJSAds: false,

  // Default VMAP adtag from the example
  // adTagUrl: `http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=`

  adsManagerLoadedCallback: () => {
    // FIX: Content blink
    player.addClass("bumper-ad");

    // Subscribe to all ads events here

    // This will be called when the preroll ad finished
    // Can't use "COMPLETE" because preroll might include more
    // than 1 ad, which triggers the "COMPLETE" event multiple times
    player.ima.addEventListener(
      window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      () => {
        console.log("All ads have been played");
        player.removeClass("bumper-ad");

        // Prevent bumper from playing indefinitely
        if (!playedBumper) playBumper();
      }
    );
  }
});

// Trigger preroll on first play
player.one("play", playPreroll);

// REST OF THE EXAMPLE IS UNTOUCHED
// #
// #
// #
// Remove controls from the player on iPad to stop native controls from stealing
// our click
var contentPlayer = document.getElementById("content_video_html5_api");
if (
  (navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/Android/i)) &&
  contentPlayer.hasAttribute("controls")
) {
  contentPlayer.removeAttribute("controls");
}

// Initialize the ad container when the video player is clicked, but only the
// first time it's clicked.
var initAdDisplayContainer = function () {
  player.ima.initializeAdDisplayContainer();
  wrapperDiv.removeEventListener(startEvent, initAdDisplayContainer);
};

var startEvent = "click";
if (
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/Android/i)
) {
  startEvent = "touchend";
}

var wrapperDiv = document.getElementById("content_video");
wrapperDiv.addEventListener(startEvent, initAdDisplayContainer);
