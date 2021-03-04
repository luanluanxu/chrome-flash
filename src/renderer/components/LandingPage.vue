<template>
  <div id="wrapper">
    <object>
      <embed id="rtmp-streamer" :src="swfUrl" bgcolor="#999999" quality="high"
             width="320" height="240" allowScriptAccess="sameDomain" plugins type="application/x-shockwave-flash" />
    </object>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  require('amd-loader')
  const RtmpStreamer = require('rtmp-streamer/rtmp-streamer')

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data () {
      return {
        swfUrl: 'static/RtmpStreamer.swf'
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    mounted () {
      var streamer = new RtmpStreamer(document.getElementById('rtmp-streamer'))
      setTimeout(() => {
        streamer.publish('rtmp://131128.livepush.myqcloud.com/live/luanxu?txSecret=72d42bb1bf677172fb90720bb7322ac7&txTime=60A60B93', 'luanxu')
      }, 1000)
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
