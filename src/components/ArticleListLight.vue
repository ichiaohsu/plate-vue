<template>
  <section class="articleListLight">
    <div class="listContainer">
      <template v-for="item in articles">
        <list-article-block-light
          :key="item.id"
          :article="item"
          :viewport="viewport"
        />
      </template>
    </div>
    <latest-list
      v-if="showLatestList"
      :latests="latest"
    />
  </section>
</template>

<script>

import LatestList from './article/LatestList.vue'
import ListArticleBlockLight from './list/ListArticleBlockLight.vue'

export default {
  name: 'ArticleListLight',
  components: {
    'latest-list': LatestList,
    'list-article-block-light': ListArticleBlockLight
  },
  props: {
    articles: {
      type: Array,
      required: true
    },
    latest: {
      type: Array,
      required: true
    },
    showLatest: {
      type: Boolean,
      default: false
    },
    viewport: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    showLatestList () {
      return this.showLatest && this.viewport >= 900
    }
  }
}
</script>
<style lang="stylus" scoped>

.articleListLight
  margin-top .5em

@media (min-width: 900px)
  .articleListLight
    display flex
    justify-content space-between
    width 768px
    margin 0 auto
  .listContainer
    width calc(100% - 360px)
    margin-top 20px
  .latest-list
    width 300px

@media (min-width: 1200px)
  .articleListLight
    width 1024px
</style>
