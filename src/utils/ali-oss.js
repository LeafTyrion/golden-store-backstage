let OSS = require('ali-oss');

// 阿里云OSS
export let client = new OSS({
    region: 'oss-cn-chengdu',
    accessKeyId: 'LTAI4FeDxmH2c3hnbdwEb9QC',
    accessKeySecret: 'dCvVuIkbAlqaIUjOtnL6dPLrijQfUR',
    bucket: 'tachikoma',
    secure: true
});

//上传
export async function put(filePath, file) {
    try {
        //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        let result = await client.put(filePath, file);
        console.log(result);
        return result;
    } catch (e) {
        console.log(e);
    }
}

// 删除
export async function remove(filePath) {
    try {
        //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        let result = await client.delete(filePath);
        console.log(result);
        return result;
    } catch (e) {
        console.log(e);
    }
}