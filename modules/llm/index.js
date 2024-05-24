const LLM = require("./models/LLM.js");
const {request} = require("../util");
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function sendLLMRequest(data){
    return await this.sendRequest(`/llms/generate`, "PUT", data)
}
async function generateImage(spaceId, modelName, prompt, variants){
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/generate`, "POST", {
        modelName: modelName,
        prompt: prompt,
        variants: variants
    })
}
module.exports = {
    sendLLMRequest,
    LLM,
    sendRequest,
    generateImage
}