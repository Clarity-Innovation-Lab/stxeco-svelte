<script lang="ts">
import { Div, Span, Strong, Em } from '@smui/common/elements';
import Button, { Label } from '@smui/button';
import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';

let webWalletLink = 'https://www.hiro.so/wallet/install-web'
let stacksOrg = 'https://stacks.org'

</script>

<div class="footer-style">
<LayoutGrid>
  <Cell span={12} class="text-center">
    <InnerGrid>
      <Cell span={6}>
        <h1>Clarity Lab</h1>
      </Cell>
      <Cell span={6}>
        <InnerGrid class="text-left text-secondary">
          <Cell span={3}>
            <p>Code</p>
            <div class="demo-cell">
              <a href="'https://github.com/Clarity-Innovation-Lab'" target="_blank">Clarity Lab</a>
            </div>
            <div class="demo-cell">
              <a href="'https://github.com/Clarity-Innovation-Lab/executor-dao/issues'" target="_blank">DAO Issues</a>
            </div>
          </Cell>
          <Cell span={3}>
            <p>Videos</p>
            <div class="demo-cell">
              <a target="_blank" href="https://www.youtube.com/watch?v=fbq6L3PrKWE">Stacks</a>
            </div>
            <div class="demo-cell">
              <a target="_blank" href="https://www.youtube.com/watch?v=OAVwd6SNJVU&t=717s">Clarity</a>
            </div>
          </Cell>
          <Cell span={3}>
            <p>Contact</p>
            <div class="demo-cell">
              <a href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">Discord</a>
            </div>
            <div class="demo-cell">
              <a href="mailto:mike@claritylab.dev" target="_blank">Enquiries</a>
            </div>
          </Cell>
          <Cell span={3}>
            <p>Partners</p>
            <div class="">
              <a class="demo-cell" href={stacksOrg} target="_blank">Foundation</a>
            </div>
            <div class="demo-cell">
              <a class="" href={webWalletLink} target="_blank">Hiro Wallet</a>
            </div>
          </Cell>
        </InnerGrid>
      </Cell>
    </InnerGrid>
  </Cell>
</LayoutGrid>
</div>
<div class="footer-end">
<LayoutGrid>
  <Cell span={12}>
    <div class="text-secondary"><Label>For the <span class="fs-2 text-danger">&hearts;</span> of crypto!</Label></div>
  </Cell>
</LayoutGrid>
</div>

<style>
  .footer-end {
    background: #fff;
    text-align: center;
    padding: 0;
    margin: 0;
  }
  .footer-style {
    background: #aeaeae;
  }
  .demo-cell {
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>