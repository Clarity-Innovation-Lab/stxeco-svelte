<script lang="ts">
import FooterLinks from './FooterLinks.svelte'
</script>
  
<div class="container-fluid footer">
    <div class=" pt-5">
      <div class="row mx-5">
        <div class="px-0 col-4">
          <div class="">
            <a class="navbar-brand" href="/">
              <img src="/img/png-assets/stx_eco_logo_white.png" alt="stacks ecosystem dao logo" width="198" height="auto"/>
            </a>
          </div>
        </div>
        <div class="col-8">
          <div class="row">
            <div class="col-12">
              <FooterLinks />
            </div>
          </div>
        </div>
      </div>
      <div class=" mx-5 mt-5 d-flex justify-content-between copy">
        <div class=" mb-4">
            <div class="copywright">EcosystemDAO&copy; 2022</div>
        </div>
        <div class=" mb-4">
          <div class="copywright">For the &hearts; of crypto!</div>
        </div>
      </div>
    </div>
  </div>  
  <style>
  .footer {
    font-family: Gilroy-ExtraBold;
    border-top: 1pt solid #fff;
    background-color: #262626;
    min-width: 100vw;
  }
  .copy {
    margin: 0 0px;
  }
.copywright {
    font-family: Akrobat-Thin;
    text-transform: uppercase;
    font-size: 1.3rem;
    line-height: 2em;
    color: #ededed;
}

  </style>