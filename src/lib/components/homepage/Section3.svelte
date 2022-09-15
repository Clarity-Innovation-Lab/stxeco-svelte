<script>
  import { ArrowDownRight, CaretRightFill } from "svelte-bootstrap-icons";
  import Sidebar from './Sidebar.svelte'

  const img1 = "https://images.prismic.io/edao/71ce7c5a-81b2-4b95-847f-cf0d31bed391_stx_eco_hands_image.png?auto=compress,format";
  const img2 = "https://images.prismic.io/edao/b45532a6-681a-4dc3-a03d-619bf221c17e_stx_eco_snapshot_image.png?auto=compress,format";
  const img3 = "https://images.prismic.io/edao/3e3a1729-9085-4013-b13b-5eb11287d222_stx_eco_coin_image.png?auto=compress,format";
  const img4 = "https://images.prismic.io/edao/a213d63a-50dc-4f85-aa3c-6f4e4061ebdb_stx_eco_laptop_image.png?auto=compress,format";
</script>

<section id="section3">
  <div class="row" style="height: 100%; width: 100%;">
    <div class="col-1 sidebar hideme" style="min-height: 100%;">
      <Sidebar context={3} />
    </div>
    <div class="col-md-11 col-sm-12" style="height: 100%;">
      <div class="m-5">
        <div class="row">
          <div class="col-12"><h1><span class="strokeme">Latest</span><br/>Proposals</h1></div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img1} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src="/img/png-assets/stx_eco_directional_arrow.png" alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Crowd Fund Proposal</h2>
                <p class="text3">Get together to decide which proposals are worth voting for.
                </p>
                <h3 class="pointer"><CaretRightFill width={10} height={10}/> vote now</h3>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img2} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src="/img/png-assets/stx_eco_directional_arrow.png" alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Crowd Fund Proposal</h2>
                <p class="text3">Get together to decide which proposals are worth voting for.
                </p>
                <h3 class="pointer"><CaretRightFill width={10} height={10}/> vote now</h3>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img3} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src="/img/png-assets/stx_eco_directional_arrow.png" alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Crowd Fund Proposal</h2>
                <p class="text3">Get together to decide which proposals are worth voting for.
                </p>
                <h3 class="pointer"><CaretRightFill width={10} height={10}/> vote now</h3>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img4} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src="/img/png-assets/stx_eco_directional_arrow.png" alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Crowd Fund Proposal</h2>
                <p class="text3">Get together to decide which proposals are worth voting for.
                </p>
                <h3 class="pointer"><CaretRightFill width={10} height={10}/> vote now</h3>
              </div>
            </div>
          </div>
          <div class="col-12 text-center my-5">
            <button class="btn mx-4 mb-4">JOIN THE FUTURE</button>
            <button class="btn btn-outline mx-4 mb-4">LAUNCH A DAO</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</section>

<style>
section {
  max-width: 100vw;
  min-width: 100vw;
  background-color: #333333;
  overflow: hidden;
  border-top: 0pt solid #fff;
}
h1 {
  font-family: Gilroy-ExtraBold;
  color: #FFA701;
  text-transform: uppercase;
  line-height: 3.3rem;
  font-size: 7.2rem;
  line-height: 6.0rem;
}
@media screen and (min-width: 0px) and (max-width: 756px) {
  h1 { 
    font-size: 4.2rem;
    line-height: 3.5rem;;
  }  /* show it on small screens */
}

.strokeme {
  color: #333333;
	-webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #FFA701;
}

h2 {
  color: #FFA701;
  text-transform: uppercase;
  font-size: 1.75rem;
  font-weight: 700;
}
h3 {
  font-family: Gilroy-ExtraBold;
  color: #FFA701;
  text-transform: uppercase;
  font-size: 1.2rem;
  font-weight: 300;
}

.text3 {
  font-family: Gilroy-Light;
  font-size: 1.3rem;
  color: #ededed;
  line-height: 1.4rem;
}
.btn {
  border: 1pt solid #FFA701;
  border-radius: 50px;
  color: #FFA701;
  font-size: 1.15rem;;
  padding: 15px 5px;
  width: 250px;
}
.btn-outline {
  background-color: #262626;
  border: none;
}
</style>
