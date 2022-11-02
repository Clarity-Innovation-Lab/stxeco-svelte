<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { fabric } from "fabric";
    import { Download } from "svelte-bootstrap-icons";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let bannerImageSrc = '/img/banner-white.png';
    export let imageSrc:string;
    export let hasVotes:boolean;
    let canvas: HTMLCanvasElement;
    let canv;
    let img1; 
    let img2;

    const saveImage = (e) => {
      const dataUrl = canv.toDataURL({
          format: 'png',
          quality: 0.8
      });
      const image = dataUrl.replace('image/png', 'image/octet-stream')
      const link = document.createElement('a')
      link.download = 'I_Voted_For_Stacks_Two_Point_One.png'
      link.href = image
      link.click()
    }

    let borders = 'none';
    const toggleRoundness= () => {
      if (borders === 'none') borders = '50%';
      else borders = 'none';
    }

    onDestroy(() => {
      if (canv) canv.dispose();
    })

    const toggleCanvas = () => {
      dispatch("toggle_canvas");
    }

    const modifiedHandler = function (evt) {
      const modifiedObject = evt.target;
      canv.sendToBack(img1);
      console.log(modifiedObject.get('left'), modifiedObject.get('top'));
    };

    onMount(async () => {
        canv = new fabric.Canvas(canvas, {
          preserveObjectStacking: true
        });
        var text = new fabric.Text('Loading image..', {
          left: 10,
          top: 10,
          strokeWidth: 0,
          stroke:"#ffffff",
          paintFirst: "stroke",
          fontFamily: 'Gilroy-Light',
          fill: '#ffffff',
          fontSize: 24,
          charSpacing:1
        });
        const rect = new fabric.Rect({
          left: 10,
          top: 10,
          width: 20,
          height: 15,
          fill: "blue"
        });
        fabric.Image.fromURL(imageSrc, function(img) {
          img1 = img.set({scaleX: (canv.width / img.width), scaleY: (canv.height / img.height), left: 0, top: 0, angle: 0});
          //img1.scaleToWidth(50);
          //img1.scaleToHeight(50);
          //canv.setBackgroundImage(img, canv.renderAll.bind(canv), {
          //  scaleX: canv.width / img1.width,
          //  scaleY: canv.height / img1.height
          //})
          canv.add(img1).renderAll();
          //canv.moveTo(img1, 50);
          //anv.on('img1:modified', modifiedHandler);
          if (hasVotes) {
            fabric.Image.fromURL(bannerImageSrc, function(img) {
              img2 = img.set({scaleX: (canv.width / img.width), scaleY: (canv.height / img.height * 0.1), left: 0, top: 340, angle: 0});
              canv.add(img2).renderAll();
              canv.remove(text).renderAll();
              //canv.moveTo(img2, 100);
              //canv.on('img2:modified', modifiedHandler);
              canv.on({
                'object:modified' : modifiedHandler
              });
            }, { crossOrigin: 'anonymous' });
          }
        }, { crossOrigin: 'anonymous' });
        // canv.add(rect);
        canv.add(text);

    });
</script>

<div class="d-flex justify-content-between">
  <p class="strapline">Step 2: Download Badge</p>
  <p class="strapline">
    <span class="mx-2"><a href="/" on:click|preventDefault={toggleCanvas}>back</a></span>
    <span class="mx-2"><a href="/" on:click|preventDefault={() => {toggleRoundness()}}>twitter preview</a></span>
    <span class="mx-2"><a href="/" on:click|preventDefault={saveImage}><Download width={40} height={40}/></a></span>
  </p>
</div>
{#if !hasVotes}
<div class="d-flex justify-content-center text-warning">
  <p>Please register a vote on the proposal to see the I Voted Banner </p>
</div>
{/if}
<div class="d-flex justify-content-center">
  <canvas bind:this={canvas} width="400" height="400" style={'width: 400px; height: 400px; border-radius: ' + borders + ';'}/>
</div>

<style>
  canvas {
    border: 1pt solid #ccc;
  }
</style>