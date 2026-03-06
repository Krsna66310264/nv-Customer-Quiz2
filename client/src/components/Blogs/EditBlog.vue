<template>
  <div class="container">
    <h1>Edit Blog</h1>
    <form v-on:submit.prevent="editBlog">
      <div class="mb-3">
        <label class="form-label">Title:</label>
        <input type="text" v-model="blog.title" class="form-control" placeholder="Enter blog title">
      </div>

      <div class="mb-3">
        <label class="form-label">Upload Images:</label>
        <upload-image @uploaded="onUploaded"></upload-image>
      </div>

      <div class="mb-3">
        <label class="form-label">Thumbnail:</label>
        <transition name="fade">
          <div class="thumbnail-pic" v-if="blog.thumbnail && blog.thumbnail !== 'null' && blog.thumbnail !== 'NA'">
            <img :src="BASE_URL + blog.thumbnail" alt="thumbnail">
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <transition-group tag="ul" name="fade" class="pictures">
          <li v-for="picture in pictures" :key="picture.id">
            <div class="img-wrapper">
              <img :src="BASE_URL + picture.name" alt="picture image">
            </div>
            <div class="btn-wrapper">
              <button class="btn btn-sm btn-info me-1"
                v-on:click.prevent="useThumbnail(picture.name)">Thumbnail</button>
              <button class="btn btn-sm btn-danger" v-on:click.prevent="delFile(picture)">Delete</button>
            </div>
          </li>
        </transition-group>
        <div class="clearfix"></div>
      </div>

      <div class="mb-3 editor-wrapper">
        <label class="form-label">Content:</label>
        <ckeditor :editor="editor" v-model="blog.content" :config="editorConfig"></ckeditor>
      </div>

      <div class="mb-3">
        <label class="form-label">Category:</label>
        <input type="text" v-model="blog.category" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">Status:</label>
        <input type="text" v-model="blog.status" class="form-control">
      </div>
      <p>
        <button type="submit">update blog</button>
        <button v-on:click="navigateTo('/blogs')">กลับ</button>
      </p>
    </form>
  </div>
</template>

<script>
import BlogsService from '../../services/BlogsService'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadService from '../../services/UploadService'
import UploadImage from '../Utils/Upload.vue' // Import

export default {
  components: {
    UploadImage // Register Component
  },
  data() {
    return {
      editor: ClassicEditor,  // 1. กำหนด Editor Build
      editorConfig: {
        licenseKey: 'GPL',
        // สามารถปรับแต่ง Toolbar ได้ตามต้องการ
        toolbar: ['heading', 'bold', 'italic', '|', 'link', 'bulletedList', 'numberedList', 'blockQuote'] // 2. ตั้งค่า Toolbar
      },
      blog: {
        title: '',
        thumbnail: 'null',
        pictures: 'null',
        content: '',
        category: '',
        status: 'saved'
      },
      pictures: [], // เก็บรายการรูปภาพที่อัปโหลด { id: 1, name: 'filename.jpg' }
      pictureIndex: 0,
      BASE_URL: 'http://localhost:8081/assets/uploads/' // URL ของ Server เรา
    }
  },
  methods: {
    // เมื่ออัปโหลดเสร็จ Component ลูกจะส่งข้อมูลไฟล์มา
    onUploaded(fileData) {
      this.pictureIndex++
      const pictureJSON = {
        id: this.pictureIndex,
        name: fileData.filename
      }
      this.pictures.push(pictureJSON)
    },
    useThumbnail(filename) {
      this.blog.thumbnail = filename
    },
    async delFile(picture) {
      let result = confirm("Want to delete?")
      if (result) {
        try {
          await UploadService.delete(picture.name)
          // ลบออกจาก array pictures
          this.pictures = this.pictures.filter(p => p.id !== picture.id)
        } catch (err) {
          console.log(err)
        }
      }
    },
    async editBlog() {
      // แปลง Array Pictures เป็น JSON String ก่อนบันทึก
      this.blog.pictures = JSON.stringify(this.pictures)
      try {
        await BlogsService.put(this.blog)
        this.$router.push({
          name: 'blogs'
        })
      } catch (err) {
        console.log(err)
      }
    },
    navigateTo(route) {
      this.$router.push(route)
    }
  },
  async created() {
    try {
      let blogId = this.$route.params.blogId
      this.blog = (await BlogsService.show(blogId)).data
      // โหลดรูปเก่าจาก DB เข้า pictures array เพื่อแสดงผลและป้องกันรูปหายตอน save
      try {
        const loaded = JSON.parse(this.blog.pictures)
        if (Array.isArray(loaded)) {
          this.pictures = loaded
          this.pictureIndex = loaded.length
        }
      } catch {
        this.pictures = []
      }
      // reset blog.pictures กลับเป็น string เดิม (จะ stringify ใหม่ตอน save)
      // ไม่ต้องแปลง blog.pictures เป็น Array เพราะ editBlog() จะ stringify this.pictures แทน
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
<style scoped></style>