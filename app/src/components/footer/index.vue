<template>
    <footer>
        <div class="container">
            <el-row :gutter="24" type="flex" justify="center">
                <el-col :xs="24" :sm="24" :md="24">
                    <div>
                        <h3>About Us</h3>
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod, quia odio voluptas repudiandae dolorem harum impedit officia animi, error modi eum laborum recusandae porro cupiditate facilis voluptate quae eos dicta sint, numquam expedita facere voluptatem dolore. Tenetur suscipit qui reprehenderit, doloremque nihil saepe, delectus quos eaque quam, voluptates ullam culpa.
                        </p>
                        <div class="contact">
                            <ul class="footer-info">
                                <li><i class="el-icon-s-home" style="color: #f45946"></i> 15 Cliff St, New York NY
                                    10038, USA</li>
                                <li><i class="el-icon-phone-outline" style="color: #3fa4f3"></i> +1 212-602-9641
                                </li>
                                <li><i class="el-icon-message" style="color: #04aea0"></i> info@example.com</li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" style="display: none">
                    <div>
                        <h3>TOPICS</h3>
                        <ul class="list-topics">
                            <li>
                                <el-link>TECHNOLOGY (122)</el-link>
                            </li>
                            <li>
                                <el-link>AUTHOR (22)</el-link>
                            </li>
                            <li>
                                <el-link>MOVIES (12)</el-link>
                            </li>
                            <li>
                                <el-link>IMAGES (5)</el-link>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="bottom-bar">
            <div class="container">
                <p>------------------    © 2020, copyright    ------------------</p>
            </div>
        </div>
    </footer>
</template>

<script>
export default { };
</script>
<style lang="scss" scoped>
/*  FOOTER  */
footer {
    background: #222222;
    color: #e9e9e9;
    padding-top: 3rem;
    margin-top: 3rem;
    h3 {
        text-align: center;
    }
    .contact,
    .list-topics {
        li {
            margin: 1rem 0;
            text-align: center;
        }
    }

    .bottom-bar {
        background: black;
        p {
            text-align: center;
            padding: 1.8rem 0;
        }
    }
}
</style>