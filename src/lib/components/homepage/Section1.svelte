<script>
// @ts-nocheck
import { goto } from '$app/navigation';
import Header from "$lib/header/Header.svelte";

// medium 
const bgvideo = 'https://prismic-io.s3.amazonaws.com/edao/ea5c92b8-d910-479c-813b-a3ef19292578_stx_eco_colour_balls_animation_medium.mp4';
export /** @type {boolean} */ let homepage;

let playing = true;
// Get the button
const openVoting = () => {
  //goto('/dao/proposals/ST132K8CVJ9B2GEDHTQS5MH3N7BR5QDMN1P1RZG3Y.edp015-stacks-2-1-activation', { replaceState: false })
  goto('/sip/twopointone', { replaceState: false })
}

// Pause and play the video, and change the button text
function toggleVideo() {
	const video = document.getElementById("myVideo");
  	if (video.paused) {
   	 	video.play();
		  playing = true;
  	} else {
    	video.pause();
		  playing = false;
  	}
}
function scrollTo() {
  const getMeTo = document.getElementById("section2");
  if (getMeTo) getMeTo.scrollIntoView({behavior: 'smooth'});
}

</script>
  
<section id="section1" style="">
  <Header {homepage}/>
  <video autoplay muted loop id="myVideo">
    <source src={bgvideo} type="video/mp4">
  </video>
  <!-- Optional: some overlay text to describe the video -->
  <div class="content">
    <h1>
      vote. voice. contribute.
      <br/>collaborate. create.
    </h1>
    <p>Be the future of decentralised democracy.
    </p>
    <button class="btn " on:click={() => { openVoting() }}>Vote for Stacks 2.1</button>
  </div>
  <div class="section-footer">
    <div class="d-flex justify-content-between">
      <div></div>
      <div><span class="pointer" on:click={scrollTo}><img src="/img/png-assets/stx_eco_arrow_down.png" alt="Scroll down" width="30" height="auto" /></span></div>
      <div>
        <span class="pointer" on:click|preventDefault={() => { toggleVideo() }}>
          {#if playing}
            <img src="/img/png-assets/stx_eco_plause_video.png" alt="Pause video" width="40" height="auto" />
          {:else}
            <img src="/img/png-assets/stx_eco_play_video.png" alt="Play video" width="40" height="auto" />
          {/if}
        </span>
      </div>
    </div>
  </div>
</section>

<style>
section {
  font-family: Gilroy-ExtraBold;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  border: 0pt solid rgb(35, 183, 37);
}
#myVideo {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  z-index: -100;
  overflow: hidden;
  min-height: 100%;
  width: auto;
  object-fit: fill;
}
.section-footer {
  position: absolute;
  height: auto;
  bottom: 0;
  background: rgb(118, 112, 112, 0);
  color: #f1f1f1;
  width: 100%;
  text-align: right;
  padding: 5px 20px;
  border: 0pt solid rgb(85, 12, 12);
} 

/* Add some content at the bottom of the video/page
.content {
  position: fixed;
  bottom: 0;
  background: rgb(118, 112, 112, 0.5);
  color: #f1f1f1;
  width: 100%;
  padding: 40px;
} 
*/
.content {
  position: absolute;
  top: 30%;
  padding-left: 5vw;
  color: #fff;
  width: 100%;
  height: auto;
}

.content h1 {
  color: #fff;
  font-size: 4.5rem;
  letter-spacing: 0.1rem;
  line-height: 4.0rem;
  text-shadow: 5px 5px 30px rgb(40, 39, 36);
}
.content p {
  font-size: 1.6rem;
  letter-spacing: 0.1rem;
  font-weight: 700;
  line-height: auto;
  color: #ededed;
  text-shadow: 5px 5px 30px rgb(40, 39, 36);
}
@media screen and (min-width: 0px) and (max-width: 940px) {
  .content { 
    top: 20%;
  }
  .content h1 { 
    font-size: 4.0rem; 
    line-height: 4.0rem;
    text-shadow: 5px 5px 30px rgb(40, 39, 36);
  }
  .content p { 
    font-size: 1.8rem; 
    line-height: 2.4rem;
    text-shadow: 5px 5px 30px rgb(40, 39, 36);
  }  /* show it on small screens */
}
.btn {
  border: none;
  border-radius: 50px!important;
  padding: 15px 20px;
  font-weight: 500;
  font-size: 0.8rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #fff;
  background-color: #4786cd;
}
.btn:hover {
  background-color: #fff;
  color: #4786cd;
}
</style>
