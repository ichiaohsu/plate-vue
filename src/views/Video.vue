<template>
  <VueDfpProvider
    :dfpid="DFP_ID"
    :dfp-units="DFP_UNITS"
    :options="dfpOptions"
    :mode="currEnv()"
    section="5975ab2de531830d00e32b2f"
  >
    <template
      slot="dfpPos"
      slot-scope="props"
    >
      <Header
        :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
        :props="props"
        :show-dfp-header-logo="showDfpHeaderLogo"
        active-section="videohub"
      />
      <template v-if="isSingleVideoPage">
        <SingleVideoBody
          :video="video"
          :videos="$store.state.playlist[OATH_ALL_VIDEO_PLAYLIST_ID]"
        >
          <ShareLight
            slot="share"
            :gtm-category="'article'"
          />
          <template v-if="mounted">
            <vue-dfp
              :is="props.vueDfp"
              v-if="viewportWidth >= 1200"
              slot="PCHD"
              :config="props.config"
              class="dfp"
              pos="PCHD"
            />
            <vue-dfp
              :is="props.vueDfp"
              v-else
              slot="MBHD"
              :config="props.config"
              :size="get($store, 'getters.adSize')"
              class="dfp"
              pos="MBHD"
            />
          </template>
          <template v-if="mounted">
            <vue-dfp
              :is="props.vueDfp"
              v-if="viewportWidth >= 1200"
              slot="PCFT"
              :config="props.config"
              class="dfp"
              pos="PCFT"
            />
            <vue-dfp
              :is="props.vueDfp"
              v-else
              slot="MBFT"
              :config="props.config"
              :size="get($store, 'getters.adSize')"
              class="dfp"
              pos="MBFT"
            />
          </template>
          <template v-if="mounted">
            <vue-dfp
              :is="props.vueDfp"
              v-if="viewportWidth >= 1200"
              slot="PCR1"
              :config="props.config"
              class="dfp"
              pos="PCR1"
              style="margin-top: 0;"
            />
            <vue-dfp
              :is="props.vueDfp"
              v-else
              slot="MBE1"
              :config="props.config"
              :size="get($store, 'getters.adSize')"
              class="dfp"
              pos="MBE1"
            />
          </template>
        </SingleVideoBody>
      </template>
      <template v-else>
        <VideoLeading>
          <vue-dfp
            :is="props.vueDfp"
            v-if="mounted && viewportWidth >= 1200"
            slot="LPCHD"
            :config="props.config"
            class="dfp"
            pos="LPCHD"
          />
          <vue-dfp
            :is="props.vueDfp"
            v-if="mounted && viewportWidth < 1200"
            slot="LMBHD"
            :config="props.config"
            :size="get($store, 'getters.adSize')"
            class="dfp"
            pos="LMBHD"
          />
        </VideoLeading>
        <template v-for="(item, index) in playlist">
          <VideoList
            :key="item.id"
            :items="$store.state.playlist[item.id]"
            :playlist="item"
            @loadmore="handleLoadmore"
          >
            <a
              v-if="!isCategoryPage"
              slot="more"
              :href="`/category/${OATH_PLAYLIST[item.id].categoryName}`"
              class="btn--more"
            >看更多<img
              src="/assets/mirrormedia/icon/arrow-slideshow-blue-right.png"
              alt="看更多"
            ></a>
            <template v-if="mounted && isCategoryPage">
              <vue-dfp
                :is="props.vueDfp"
                v-if="viewportWidth >= 1200"
                :key="`${index}-LPCFT`"
                slot="LPCFT"
                :config="props.config"
                class="dfp"
                pos="LPCFT"
              />
              <vue-dfp
                :is="props.vueDfp"
                v-else
                :key="`${index}-LMBFT`"
                slot="LMBFT"
                :config="props.config"
                :size="get($store, 'getters.adSize')"
                class="dfp"
                pos="LMBFT"
              />
            </template>
          </VideoList>
          <template v-if="mounted && !isCategoryPage">
            <vue-dfp
              :is="props.vueDfp"
              v-if="viewportWidth >= 1200 && index === 4"
              :key="`${index}-LPCFT`"
              :config="props.config"
              class="dfp"
              pos="LPCFT"
            />
            <vue-dfp
              :is="props.vueDfp"
              v-if="viewportWidth < 1200 && index === 2"
              :key="`${index}-LMBFT`"
              :config="props.config"
              :size="get($store, 'getters.adSize')"
              class="dfp"
              pos="LMBFT"
            />
          </template>
        </template>
      </template>
      <section class="footer container">
        <Footer />
      </section>
      <!-- <LiveStream v-if="hasEventEmbedded" :mediaData="eventEmbedded" /> -->
      <Share
        v-if="!isSingleVideoPage"
        left="20px"
        bottom="20px"
      />
      <LazyItemWrapper
        v-if="(viewportWidth < 550)"
        :load-after-page-loaded="true"
      >
        <DfpST :props="props">
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpST"
            :config="props.config"
            pos="MBST"
          />
        </DfpST>
      </LazyItemWrapper>
      <DfpCover v-if="mounted && showDfpCoverAdFlag && viewportWidth < 1199">
        <vue-dfp
          :is="props.vueDfp"
          v-if="(viewportWidth < 550)"
          slot="ad-cover"
          pos="LMBCVR"
          :config="props.config"
        />
      </DfpCover>
      <DfpCover
        v-if="mounted && showDfpCoverAd2Flag && viewportWidth < 1199"
        :show-close-btn="false"
        class="raw"
      >
        <vue-dfp
          :is="props.vueDfp"
          v-if="(viewportWidth < 550)"
          slot="ad-cover"
          pos="LMBCVR2"
          :config="props.config"
        />
      </DfpCover>
      <DfpCover
        v-if="mounted && showDfpCoverInnityFlag && viewportWidth < 1199"
        :show-close-btn="false"
        class="raw"
      >
        <vue-dfp
          :is="props.vueDfp"
          v-if="(viewviewportWidthport < 550)"
          slot="ad-cover"
          pos="LMBCVR3"
          :config="props.config"
        />
      </DfpCover>
    </template>
  </VueDfpProvider>
</template>
<script>
import Cookie from 'vue-cookie'
import DfpCover from '../components/DfpCover.vue'
import DfpST from '../components/DfpST.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import LiveStream from '../components/LiveStream.vue'
import SingleVideoBody from '../components/video/SingleVideoBody.vue'
import Share from '../components/Share.vue'
import ShareLight from '../components/share/ShareLight.vue'
import VideoLeading from '../components/video/VideoLeading.vue'
import VideoList from '../components/video/VideoList.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
// import moment from 'moment'
import { DFP_ID, DFP_UNITS, DFP_OPTIONS, DFP_SIZE_MAPPING, OATH_ALL_VIDEO_PLAYLIST_ID, OATH_PLAYLIST, SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { adtracker } from 'src/util/adtracking'
import { currEnv, sendAdCoverGA, updateCookie } from '../util/comm'
import { get, truncate } from 'lodash'
import { getRole } from '../util/mmABRoleAssign'

const debug = require('debug')('CLIENT:VIEWS:video')

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { endpoints: ['sectionfeatured', 'sections', 'topics'] })
    .catch(err => {
      if (err.status === 404) {
        const e = new Error()
        e.massage = 'Page Not Found'
        e.code = '404'
        throw e
      } else {
        throw err
      }
    })
}

const fetchEvent = (store, eventType = 'embedded') => {
  return store.dispatch('FETCH_EVENT', {
    params: {
      max_results: 1,
      where: {
        isFeatured: true,
        eventType: eventType
      }
    }
  })
}

const fetchPlaylist = (store, { id, params }) => {
  return store.dispatch('FETCH_OATH_PLAYLIST', {
    id,
    params
  })
    .catch(() => {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    })
}

const fetchVideo = (store, { id }) => {
  return store.dispatch('FETCH_OATH_VIDEO', {
    id
  })
    .catch(() => {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    })
}

const fetchVideoByPlaylist = (store, { id, params = {} }) => {
  return store.dispatch('FETCH_OATH_VIDEO_BY_PLAYLIST', {
    id,
    params
  })
}

const fetchPartners = (store) => {
  return store.dispatch('FETCH_PARTNERS', {
    params: {
      max_results: 25,
      page: 1
    }
  })
}

const fetchFullPlaylist = (store, jobs = []) => {
  const prefetchPlaylist = Object.values(OATH_PLAYLIST)
    .sort((a, b) => a.order - b.order)
    .slice(2)
    .map(playlist => playlist.id)
  prefetchPlaylist.map(playlistId => {
    jobs.push(fetchPlaylist(store, { id: playlistId }))
    jobs.push(fetchVideoByPlaylist(store, { id: playlistId }))
  })
  return jobs
}

export default {
  name: 'AppVideo',
  components: {
    DfpCover,
    DfpST,
    Footer,
    Header,
    LazyItemWrapper,
    LiveStream,
    SingleVideoBody,
    Share,
    ShareLight,
    VideoLeading,
    VideoList,
    VueDfpProvider
  },
  asyncData ({ store, route }) {
    const jobs = [
      fetchCommonData(store),
      fetchPartners(store)
    ]

    if (route.fullPath.match(/\/section\//)) {
      const prefetchPlaylist = Object.values(OATH_PLAYLIST)
        .sort((a, b) => a.order - b.order)
        .slice(0, 2)
        .map(playlist => playlist.id)
      prefetchPlaylist.map(playlistId => {
        jobs.push(fetchPlaylist(store, { id: playlistId }))
        jobs.push(fetchVideoByPlaylist(store, { id: playlistId }))
      })
    } else if (route.fullPath.match(/\/category\//)) {
      const playlistInfo = Object.entries(OATH_PLAYLIST).find(item => item[1].categoryName === route.fullPath.split('/')[2])
      const playlistId = playlistInfo[0]
      jobs.push(fetchPlaylist(store, { id: playlistId }))
      jobs.push(fetchVideoByPlaylist(store, { id: playlistId, params: { max_results: 12 } }))
    } else if (route.fullPath.match(/\/video\//)) {
      jobs.push(fetchVideo(store, { id: route.fullPath.split('/')[2] }))
      jobs.push(fetchVideoByPlaylist(store, { id: OATH_ALL_VIDEO_PLAYLIST_ID, params: { max_results: 8 } }))
    }
    return Promise.all(jobs)
  },
  metaInfo () {
    const ogUrl = `${SITE_URL}${this.$route.path}`
    const relUrl = `${SITE_MOBILE_URL}${this.$route.path}`
    const sections = get(this.$store, 'state.commonData.sections.items', []) || []
    const videohub = sections.filter(section => section.name === 'videohub')[0]
    const isListing = this.$route.path.match(/(\/section\/|\/category\/)/)

    let title
    let description = get(this.video, 'description') || get(videohub, 'ogDescription') || get(videohub, 'description')
    let image = get(videohub, 'ogImage') || get(videohub, 'image')
    description = description ? truncate(description, { length: 197 }) : SITE_DESCRIPTION
    image = image ? get(image, 'image.resizedTargets.desktop.url') : SITE_OGIMAGE

    switch (true) {
      case /\/category\//.test(this.$route.path):
        title = get(this.playlist[0], 'name')
        break
      case /\/video\//.test(this.$route.path):
        title = get(this.video, 'name')
        image = get(this.video, 'feedThumbnail.url') || image
        break
      default:
        title = get(videohub, 'ogTitle') || get(videohub, 'title')
    }

    if (!title && process.env.VUE_ENV === 'server') {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

    return {
      title,
      titleTemplate: isListing ? `%s - ${SITE_TITLE}` : null,
      meta: [
        { name: 'robots', content: 'index' },
        { vmid: 'description', name: 'description', content: description },
        { vmid: 'og:title', property: 'og:title', content: title },
        { vmid: 'og:description', property: 'og:description', content: description },
        { vmid: 'og:url', property: 'og:url', content: ogUrl },
        { vmid: 'og:image', property: 'og:image', content: image },
        { vmid: 'twitter:title', name: 'twitter:title', content: title },
        { vmid: 'twitter:description', name: 'twitter:description', content: description },
        { vmid: 'twitter:image', name: 'twitter:image', content: image },
        { name: 'section-name', content: 'videohub' }
      ],
      link: [
        { rel: 'alternate', href: relUrl }
      ]
    }
  },
  data () {
    return {
      DFP_ID,
      DFP_UNITS,
      OATH_ALL_VIDEO_PLAYLIST_ID,
      OATH_PLAYLIST,
      abIndicator: '',
      dfpHeaderLogoLoaded: false,
      mounted: false,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverInnityFlag: false,
      showDfpHeaderLogo: false
    }
  },
  computed: {
    dfpOptions () {
      const currentInstance = this
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: function (event) {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')

          /**
           * Because googletag.pubads().addEventListener('slotRenderEnded', afterEachAdLoaded) can't be removed.
           * We have check if current page gets changed with checking by sessionId to prevent from runnig this outdated callback.
           */
          const elSessionId = dfpCover.getAttribute('sessionId')
          debug('this.sessionId', this.sessionId, elSessionId)
          if (elSessionId !== this.sessionId) { return }

          const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
          const loadInnityAd = () => {
            debug('Event "noad2" is detected!!')
            if (currentInstance.showDfpCoverAd2Flag && !currentInstance.showDfpCoverInnityFlag) {
              sendAdCoverGA('innity')
              debug('noad2 detected and go innity')
              currentInstance.showDfpCoverInnityFlag = true
            }
          }
          window.addEventListener('noad2', loadInnityAd)
          window.parent.addEventListener('noad2', loadInnityAd)

          switch (position) {
            case 'LMBCVR':
              sendAdCoverGA('dfp')
              if (adDisplayStatus === 'none') {
                updateCookie({ currEnv: currentInstance.dfpMode }).then((isVisited) => {
                  currentInstance.showDfpCoverAd2Flag = !isVisited
                })
              } else {
                updateCookie({ currEnv: currentInstance.dfpMode }).then((isVisited) => {
                  currentInstance.showDfpCoverAdFlag = !isVisited
                })
              }
              break
            case 'LMBCVR2':
              sendAdCoverGA('ad2')
              debug({ msg: 'ad2 loaded' })
              if (adDisplayStatus === 'none') {
                debug({ msg: 'dfp response no ad2' })
              }
              break
            case 'LMBCVR3':
              debug('adInnity loaded')
              sendAdCoverGA('innity')
              if (adDisplayStatus === 'none') {
                debug('dfp response no innity')
              }
              break
            case 'LOGO':
              if (adDisplayStatus !== 'none') {
                currentInstance.showDfpHeaderLogo = true
              }
              currentInstance.dfpHeaderLogoLoaded = true
              break
          }
          adtracker({
            el: dfpCover,
            slot: event.slot.getSlotElementId(),
            position,
            isAdEmpty: adDisplayStatus === 'none',
            sessionId: elSessionId
          })
        },
        setCentering: true,
        sizeMapping: DFP_SIZE_MAPPING
      })
    },
    // eventEmbedded () {
    //   return get(this.$store, 'state.eventEmbedded.items.0')
    // },
    eventLogo () {
      return get(this.$store, 'state.eventLogo.items.0')
    },
    // hasEventEmbedded () {
    //   const _now = moment()
    //   const _eventStartTime = moment(new Date(get(this.eventEmbedded, [ 'startDate' ])))
    //   let _eventEndTime = moment(new Date(get(this.eventEmbedded, [ 'endDate' ])))
    //   if (_eventEndTime && (_eventEndTime < _eventStartTime)) {
    //     _eventEndTime = moment(new Date(get(this.eventEmbedded, [ 'endDate' ]))).add(12, 'h')
    //   }
    //   return (_eventStartTime && _eventEndTime && (_now >= _eventStartTime) && (_now <= _eventEndTime))
    // },
    isCategoryPage () {
      return this.$route.fullPath.match(/category/)
    },
    isSingleVideoPage () {
      return this.$route.fullPath.match(/\/video\//)
    },
    playlist () {
      const playlist = Object.values(this.$store.state.playlist.info) || []
      if (this.isCategoryPage) {
        const category = this.$route.fullPath.split('/')[2]
        const playlistInfo = Object.entries(OATH_PLAYLIST).find(item => item[1].categoryName === category)
        return playlist.filter(item => item.id === playlistInfo[0])
      } else {
        const filtered = playlist.filter(item => this.$store.state.playlist[item.id] && this.$store.state.playlist[item.id].length > 0)
        return filtered.sort((a, b) => OATH_PLAYLIST[a.id].order - OATH_PLAYLIST[b.id].order)
      }
    },
    section () {
      const sections = get(this.$store, 'state.commonData.sections.items') || []
      return sections.filter(section => section.name === 'videohub')[0]
    },
    title () {
      if (this.isCategoryPage) {
        return `${this.playlist[0].name} - ${SITE_TITLE}`
      } else if (this.isSingleVideoPage) {
        return this.video.name
      } else {
        return `${this.section.title} - ${SITE_TITLE}`
      }
    },
    video () {
      if (this.isSingleVideoPage) {
        const id = this.$route.fullPath.split('/')[2]
        return this.$store.state.videos[id]
      }
      return ({})
    },
    videos () {
      const videos = []
      Object.keys(this.$store.state.playlist)
        .filter(key => key !== 'info')
        .map(key => {
          this.$store.state.playlist[key].map(item => videos.push(item))
        })
      return videos
    },
    viewportWidth () {
      return this.$store.state.viewport.width
    }
  },
  beforeMount () {
    // this.abIndicator = this.getMmid()
    const jobs = [
      // fetchEvent(this.$store, 'embedded'),
      fetchEvent(this.$store, 'logo')
    ]
    if (this.$route.fullPath.match(/\/section\//)) {
      fetchFullPlaylist(this.$store, jobs)
    }
    Promise.all(jobs)
  },
  mounted () {
    this.mounted = true
    this.sendGA()
  },
  methods: {
    currEnv,
    get,
    getMmid () {
      const mmid = Cookie.get('mmid')
      let assisgnedRole = get(this.$route, ['query', 'ab'])
      if (assisgnedRole) {
        assisgnedRole = assisgnedRole.toUpperCase()
      }
      const role = getRole({
        mmid,
        distribution: [
          { id: 'A', weight: 50 },
          { id: 'B', weight: 50 }]
      })
      return assisgnedRole || role
    },
    handleLoadmore ({ id, offset }) {
      fetchVideoByPlaylist(this.$store, { id: id, params: { max_results: 12, offset: offset } })
    },
    sendGA () {
      const categoryLabel = this.$route.fullPath.match(/category/)
        ? Object.entries(OATH_PLAYLIST).find(item => item[0] === this.playlist[0].id)[1].categoryName
        : ''
      window.ga('set', 'contentGroup1', this.section.name)
      window.ga('set', 'contentGroup2', categoryLabel)
      window.ga('set', 'contentGroup3', 'list')
      window.ga('send', 'pageview', { title: this.title, location: document.location.href })
    }
  }
}
</script>
<style lang="stylus" scoped>
.dfp
  display inline-block
  width 100%
  margin 20px auto

.btn--more
  display flex
  align-items center
  padding 0
  margin 10px 0 0 auto
  color #064f77
  font-size .75rem
  font-weight 600
  background-color transparent
  border none
  img
    height 1em
    margin-left 5px

@media (min-width: 1200px)
  .btn--more
    font-size 1rem
</style>
