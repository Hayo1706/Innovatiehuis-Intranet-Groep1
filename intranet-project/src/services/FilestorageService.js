import axiosClient from './AxiosClient';
//import { jsonToJsDate } from './DataConverter';

var FilestorageService = function () {


    async function getFoldersOfProject(projectid, path) {
        const { response } = await axiosClient.get(`/projects/${projectid}/folders?path=` + path, { timeout: 2000 });
        return response;
    }

    async function moveFolder(projectid, from, to, rename) {
        const { response } = await axiosClient.put(`/projects/${projectid}/folders`, { from, to, rename } , { timeout: 2000 });
        return response;
    }

    async function createFolder(projectid, path, name) {
        const { response } = await axiosClient.post(`/projects/${projectid}/folders?path=` + path, { name }, { timeout: 2000 });
        return response;
    }

    async function deleteFolder(projectid, path, conf) {
        const { response } = await axiosClient.delete(`/projects/${projectid}/folders?path=` + path + `&conf=` + conf, { timeout: 2000 });
        return response;
    }

    async function renameFolder(projectid, from, to, rename) {
        const { response } = await axiosClient.put(`/projects/${projectid}/folders`, { from, to, rename }, { timeout: 2000 });
        return response;
    }

    async function getFilesOfPath(projectid, path) {
        const { response } = await axiosClient.get(`/projects/${projectid}/files?path=` + path, { timeout: 2000 });
        return response;
    }

    async function uploadFiles(projectid, path, file, conf) {
        const { response } = await axiosClient.post(`/projects/${projectid}/files?path=` + path + `&conf=` + conf, file , { timeout: 20000 })
        return response;
    }

    async function moveFile(projectid, from, to){
        const { response } = await axiosClient.put(`/projects/${projectid}/files`, {from, to} , { timeout: 20000 })
        return response;
    }

    async function downloadFile(projectid, path) {
       const { response } = await axiosClient.get(`/projects/${projectid}/file?path=` + path + `&randomized=` + Math.random(), { responseType: "blob", timeout: 2000 })
       return response;
    }

    async function renameFile(projectid, path, name, type) {
        const { response } = await axiosClient.put(`/projects/${projectid}/file?path=` + path, { name, type }, { timeout: 2000 })
        return response;
    }

    async function deleteFile(projectid, path) {
        const { response } = await axiosClient.delete(`/projects/${projectid}/file?path=` + path, { timeout: 2000 })
        return response;
    }


    

    return {
        getFilesOfPath,
        uploadFiles,
        downloadFile,
        deleteFile,
        moveFile,
        renameFile,
        getFoldersOfProject,
        createFolder,
        deleteFolder,
        renameFolder,
        moveFolder
    }



}
export default FilestorageService();