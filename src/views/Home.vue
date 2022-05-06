<template>

</template>

<script>
export default {
  name: "Home",
  data: function (){
    return {
      user: {
        id: this.$route.params.user.id,
        username: this.$route.params.user.username,
        password: this.$route.params.user.password,
        email: this.$route.params.user.email
      }
    }
  }
}
</script>

