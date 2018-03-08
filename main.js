new Vue({
    el: '#app',
    data: function() {
        return {
            advertList: '',
            dialogVisible: false,
            fileList: [],
            options: [{
                value: 1,
                label: 'App开始页'
            }, {
                value: 2,
                label: '首页顶部'
            }],
            value: 1,
            form: {
                title: '',
                content: '',
                link: '',
                type: [],
                resource: 'firstPage',
                desc: ''
            },
            importFileUrl: '/promo/manage/advertisement/upload'
        }
    },
    watch: {
        urlPathComputed () {
            this.getComputedist()
        }
    },
    mounted () {
        this.getAppList();
    },
    computed: {
        urlPathComputed () {
            if (this.value === 1) {
                return '/promo/manage/advertisement/getFirstPageAd'
            } else {
                return '/promo/manage/advertisement/getContentPageAds'
            }
        },
        upLoadData () {
            return {
                title: this.form.title,
                content: this.form.content,
                httpUrl: this.form.link,
                adType: this.form.resource
            }
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList, file) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        beforeAvatarUpload(file, fileList) {
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                console.log('上传模板大小不能超过 20MB!');
                this.$message.warning('上传模板大小不能超过 20MB!');
                this.fileList.pop();
            }
        },
        onSubmit() {
            console.log('submit!');
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        getAppList() {
            let vm = this
            axios.get('/promo/manage/advertisement/getFirstPageAd')
                .then(function (response) {
                    vm.advertList =  [];
                    vm.advertList.push(response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getComputedist() {
            let vm = this
            axios.get(vm.urlPathComputed)
                .then(function (response) {
                    if (Object.prototype.toString.call(response.data) === '[object Array]') {
                        vm.advertList = response.data;
                    } else {
                        vm.advertList =  [];
                        vm.advertList.push(response.data)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        // 删除广告
        delateAd(id) {
            // /promo/manage/advertisement/delete
            let vm = this
            axios.post('/promo/manage/advertisement/delete',{
                id: id
            })
                .then(function (response) {
                    if (response.data.isSuccess) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        vm.getComputedist();
                    } else {
                        this.$message({
                            message: '删除失败',
                            type: 'success'
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        sureUploadAdver (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.fileList.length < 1) {
                        this.$message({
                            message: '上传文件不能为空',
                            type: 'error'
                        })
                        return false
                    }
                    this.$refs.upload.submit()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 上传成功调用
        successUploadFile(response, file, fileList) {
            console.log(response)
            if(response.isSuccess) {
                this.$message({
                    message: response.message,
                    type: 'success'
                })
                this.getComputedist();
                this.dialogVisible = false;
            } else {
                this.$message({
                    message: response.message,
                    type: 'error'
                })
            }
        },
        // 上传失败调用
        errorUploadFile(err, file ,fileList) {
            console.log(err)
        }
    }
})