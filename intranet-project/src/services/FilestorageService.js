import axiosClient from './AxiosClient';

var FilestorageService = function () {
    async function getFoldersOfProject(projectid, path) {
        const response = await axiosClient.get(`/projects/${projectid}/folders?path=` + path, { timeout: 2000 });
        return response;
    }
    async function moveFolder(projectid, from, to, rename) {
        const response = await axiosClient.put(`/projects/${projectid}/folders`, { from, to, rename } , { timeout: 2000 });
        return response;
    }
    async function createFolder(projectid, path, name) {
        const response = await axiosClient.post(`/projects/${projectid}/folders?path=` + path, { name }, { timeout: 2000 });
        return response;
    }
    async function deleteFolder(projectid, path, may_delete_contents) {
        const response = await axiosClient.delete(`/projects/${projectid}/folders?path=` + path + `&may_delete_contents=` + may_delete_contents, { timeout: 2000 });
        return response;
    }
    async function renameFolder(projectid, from, to, rename) {
        const response = await axiosClient.put(`/projects/${projectid}/folders`, { from, to, rename }, { timeout: 2000 });
        return response;
    }
    async function getFilesOfPath(projectid, path) {
        const response = await axiosClient.get(`/projects/${projectid}/files?path=` + path, { timeout: 2000 });
        return response;
    }
    async function uploadFile(projectid, path, file, may_overwrite=false, config) {
        const response = await axiosClient.post(`/projects/${projectid}/files?path=` + path + `&may_overwrite=` + may_overwrite, file , config)
        return response;
    }
    async function moveFile(projectid, from, to){
        const response = await axiosClient.put(`/projects/${projectid}/files`, {from, to} , { timeout: 2000 })
        return response;
    }
    async function downloadFile(projectid, path, version) {
       const response = await axiosClient.get(`/projects/${projectid}/file?path=` + path + `&version=` + version + `&randomized=` + Math.random(), { responseType: "blob", timeout: 2000 })
       return response;
    }
    async function renameFile(projectid, path, name, type) {
        const response = await axiosClient.put(`/projects/${projectid}/file?path=` + path, { name, type }, { timeout: 2000 })
        return response;
    }
    async function deleteFile(projectid, path) {
        const response = await axiosClient.delete(`/projects/${projectid}/file?path=` + path, { timeout: 2000 })
        return response;
    }
    async function recoverFile(projectid, path) {
        const response = await axiosClient.patch(`/projects/${projectid}/file/restore?path=` + path, { timeout: 2000 })
        return response
    }
    async function getOlderFiles(projectid){
        const response = await axiosClient.get(`/projects/${projectid}/files/deleted`, {timeout: 2000 })
        return response
    }

    return {
        getFilesOfPath,
        uploadFile,
        downloadFile,
        deleteFile,
        moveFile,
        renameFile,
        getFoldersOfProject,
        createFolder,
        deleteFolder,
        renameFolder,
        moveFolder, 
        recoverFile,
        getOlderFiles,
    }
}
export default FilestorageService();