<template>
  <div>
    <h1>Show Blog</h1>
    <p>id: {{ blog.id }}</p>
    <p>title: {{ blog.title }}</p>

    <!-- Thumbnail -->
    <div v-if="blog.thumbnail && blog.thumbnail !== 'null' && blog.thumbnail !== 'NA'">
      <p><strong>Thumbnail:</strong></p>
      <img :src="BASE_URL + blog.thumbnail" alt="thumbnail"
        style="max-width:300px; border:1px solid #ddd; padding:5px; margin-bottom:10px; display:block;">
    </div>

    <!-- Pictures Gallery -->
    <div v-if="parsedPictures.length > 0">
      <p><strong>รูปภาพทั้งหมด ({{ parsedPictures.length }} รูป):</strong></p>
      <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
        <img v-for="pic in parsedPictures" :key="pic.id" :src="BASE_URL + pic.name" alt="picture"
          style="max-width:180px; border:1px solid #eee; padding:5px;">
      </div>
    </div>

    <p>content: <span v-html="blog.content"></span></p>
    <p>category: {{ blog.category }}</p>
    <p>status: {{ blog.status }}</p>
    <p>
      <button v-on:click="navigateTo('/blog/edit/' + blog.id)">แก้ไข blog</button>
      <button v-on:click="navigateTo('/blogs')">กลับ</button>
    </p>
  </div>
</template>

<script>
import BlogsService from '../../services/BlogsService'

export default {
  data() {
    return {
      blog: {
        id: null,
        title: '',
        thumbnail: 'null',
        pictures: 'null',
        content: '',
        category: '',
        status: ''
      },
      BASE_URL: 'http://localhost:8081/assets/uploads/'
    }
  },
  computed: {
    parsedPictures() {
      try {
        const pics = JSON.parse(this.blog.pictures)
        return Array.isArray(pics) ? pics : []
      } catch {
        return []
      }
    }
  },
  async created() {
    try {
      let blogId = this.$route.params.blogId
      this.blog = (await BlogsService.show(blogId)).data
      console.log('blog data:', this.blog)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    }
  }
}
</script>
<style scoped></style>