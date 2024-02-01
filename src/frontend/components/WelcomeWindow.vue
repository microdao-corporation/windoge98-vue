<script setup lang="ts">
import { onMounted } from "vue";
import WindowLogo from "./WindowLogo.vue";
import { useIcrc1Agent } from "../hooks/useIcrc1Agent";
import { calculateBurned, natToFormattedString } from "../utils/numberUtils";

const icpAgent = useIcrc1Agent("ryjl3-tyaaa-aaaaa-aaaba-cai");
const windogeAgent = useIcrc1Agent("rh2pm-ryaaa-aaaan-qeniq-cai");

onMounted(() => {
  windogeAgent.fetchMaxSupply();
  icpAgent.fetchIcrc1BalanceOf(
    "3scjg-z33zr-ll3bt-hdsov-kkitm-3tsml-tvgkt-d6jwa-onz35-hkfq5-zae",
    "treasury_icp"
  );
  windogeAgent.fetchIcrc1BalanceOf(
    "3scjg-z33zr-ll3bt-hdsov-kkitm-3tsml-tvgkt-d6jwa-onz35-hkfq5-zae",
    "treasury_exe"
  );
});
</script>

<template>
  <WindowLogo />
  <p>
    Windoge 98 is a nostalgic take on memecoins, designed as an ICRC-1 token on the
    Internet Computer (IC), this token is a nod to the Windows 98 operating system many of
    us grew up on, blending the world of classic computing and 90's aesthetic with state
    of the art blockchain technology.
  </p>
  <p>
    Windoge 98 doesn't just aim to be another memecoin; it plans to power the entire
    Internet Computer!
  </p>

  <div>
    <h5 style="margin-bottom: 10px; margin-top: 0px">Token Information</h5>
    <div class="box" style="background-color: white; padding: 4px">
      <strong>Token standard: </strong>
      ICRC-1 <br />
      <strong>Ticker symbol: </strong>
      $EXE <br />
      <strong>Canister: </strong> rh2pm-ryaaa-aaaan-qeniq-cai <br />
      <strong>Max supply: </strong>
      10,000,000 EXE<br />
      <strong>Circulating supply: </strong>
      {{
        windogeAgent.data.max_supply && natToFormattedString(windogeAgent.data.max_supply)
      }}
      EXE<br />
      <strong>Total burned: </strong>
      🔥
      {{ windogeAgent.data.max_supply && calculateBurned(windogeAgent.data.max_supply) }}
      EXE <br />
      <strong
        ><a
          href="https://t5t44-naaaa-aaaah-qcutq-cai.raw.ic0.app/holder/3scjg-z33zr-ll3bt-hdsov-kkitm-3tsml-tvgkt-d6jwa-onz35-hkfq5-zae/tokens"
          targer="_blank"
          >Treasury</a
        >
        ICP:
      </strong>
      {{ icpAgent.data.treasury_icp && natToFormattedString(icpAgent.data.treasury_icp) }}
      ICP<br />
      <strong
        ><a href="https://sneed.one/?token=rh2pm-ryaaa-aaaan-qeniq-cai" targer="_blank"
          >Treasury</a
        >
        EXE:
      </strong>
      {{
        windogeAgent.data.treasury_exe &&
        natToFormattedString(windogeAgent.data.treasury_exe)
      }}
      EXE<br />
      <strong>Treasury principal: </strong>
      3scjg-z33zr-ll3bt-hdsov-kkitm-3tsml-tvgkt-d6jwa-onz35-hkfq5-zae
    </div>
  </div>

  <p style="text-align: center; float: bottom">
    <strong>Links: </strong>
    <a href="https://x.com/windoge_98" target="_blank">X.com</a> |
    <a
      href="https://oc.app/community/ow6el-gyaaa-aaaar-av5na-cai/?ref=y3rqn-fyaaa-aaaaf-a7z6a-cai"
      target="_blank"
      >OpenChat</a
    >
    | <a href="https://t.me/windoge98" target="_blank">Telegram</a> |
    <a href="https://discord.gg/CnMRrtaj3h" target="_blank">Discord</a>
    |
    <a href="/whitepaper.pdf" target="_blank">Whitepaper</a> |
    <a href="https://sneed.one/?token=rh2pm-ryaaa-aaaan-qeniq-cai" target="_blank"
      >Explorer</a
    >
    |
    <a href="https://www.coingecko.com/en/coins/windoge98" target="_blank">CoinGecko</a>
    |
    <a href="https://coinmarketcap.com/currencies/windoge98/" target="_blank"
      >CoinMarketCap</a
    >
  </p>

  <p style="text-align: center; float: bottom">
    <strong>Exchanges: </strong>
    <a href="https://data.sonic.ooo/tokens/rh2pm-ryaaa-aaaan-qeniq-cai">Sonic</a> |
    <a href="https://info.icpswap.com/swap/token/details/rh2pm-ryaaa-aaaan-qeniq-cai"
      >ICPSwap</a
    >
  </p>
</template>
