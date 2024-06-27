const {request} = require("../util");

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function getGalleriesMetadata(spaceId) {
    return await this.sendRequest(`/spaces/containerObject/meta/${spaceId}/galleries`, "GET");
}

async function getGallery(spaceId, galleryId) {
    return await this.sendRequest(`/spaces/containerObject/${spaceId}/${galleryId}`, "GET");
}

async function addGallery(spaceId, galleryData) {
    galleryData.metadata = ["id", "config"];
    return await this.sendRequest(`/spaces/containerObject/${spaceId}/galleries`, "POST", galleryData);
}

async function deleteGallery(spaceId, galleryId) {
    return await this.sendRequest(`/spaces/containerObject/${spaceId}/${galleryId}`, "DELETE");
}

async function addImage(spaceId, galleryId, imageData) {
    let objectURI = encodeURIComponent(`${galleryId}/images`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", imageData);
}
async function getImage(spaceId, galleryId, imageId){
    let objectURI = encodeURIComponent(`${galleryId}/${imageId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function getGalleryConfig(spaceId, galleryId){
    let objectURI = encodeURIComponent(`${galleryId}/config`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function getGalleryOpenAIHistory(spaceId, galleryId){
    let objectURI = encodeURIComponent(`${galleryId}/openAIHistory`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function getGalleryMidjourneyHistory(spaceId, galleryId){
    let objectURI = encodeURIComponent(`${galleryId}/midjourneyHistory`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function updateGalleryConfig(spaceId, galleryId, configData){
    let objectURI = encodeURIComponent(`${galleryId}/config`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", configData);
}

module.exports = {
    sendRequest,
    getGalleriesMetadata,
    getGallery,
    addGallery,
    deleteGallery,
    addImage,
    getImage,
    getGalleryConfig,
    getGalleryOpenAIHistory,
    getGalleryMidjourneyHistory,
    updateGalleryConfig
}