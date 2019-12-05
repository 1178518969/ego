<template>
    <div class="FL">
        <div class="FL-left">
<Category />
        </div>
        <div class="FL-right">
<Content />
        </div>
        
    </div>
</template>

<script>
import Category from "./Category/Category"
import Content from "./Content/Content"
export default {
    name:"Fenlei",
    data(){
        return{}
    },
    components:{
        Category,
        Content
    }
}
</script>

<style scoped>
.FL{
    width: 90%;
    margin: 0 auto;
    display: flex;
}
.FL-left{
    flex-grow: 1
}
.FL-right{
    flex-grow: 3
}
</style>