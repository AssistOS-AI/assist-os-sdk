const {request, notificationService} = require("../util");
const Space = require('./models/Space.js');
const Announcement = require('./models/Announcement.js');
const announcementType = "announcements";

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function addSpaceAnnouncement(spaceId, announcementData) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements`, "POST", announcementData)
}

async function getSpaceAnnouncement(spaceId, announcementId) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements/${announcementId}`, "GET")
}

async function getSpaceAnnouncements(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements`, "GET")
}

async function deleteSpaceAnnouncement(spaceId, announcementId) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements/${announcementId}`, "DELETE")
}

async function updateSpaceAnnouncement(spaceId, announcementId, announcementData) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements/${announcementId}`, "PUT", announcementData)
}

async function addSpaceChatMessage(spaceId, chatId, messageData) {
    return await this.sendRequest(`/spaces/${spaceId}/chat/${chatId}`, "POST", messageData)
}



async function createSpace(spaceName) {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        Cookie: this.__securityContext.cookies
    };
    const bodyObject = {
        spaceName: spaceName
    }
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bodyObject)
    };
    const response = await fetch(`/spaces`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return (await response.json());
}

async function loadSpace(spaceId) {
    let requestURL = spaceId ? `/spaces/${spaceId}` : `/spaces`;
    return await this.sendRequest(requestURL, "GET");
}

async function storeSpace(spaceId, jsonData = null, apiKey = null, userId = null) {
    let headers = {
        "Content-type": "application/json; charset=UTF-8",
        Cookie: this.__securityContext.cookies
    };
    if (apiKey) {
        headers["apikey"] = `${apiKey}`;
        headers["initiatorid"] = `${userId}`;
    }

    let options = {
        method: "PUT",
        headers: headers,
        body: jsonData
    };
    let response = await fetch(`/spaces/${spaceId}`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return await response.text();
}

async function deleteSpace(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}`, "DELETE");
}

async function addKeyToSpace(spaceId, userId, keyType, apiKey) {
    let result;
    let headers = {
        "Content-type": "application/json; charset=UTF-8",
        Cookie: this.__securityContext.cookies
    };
    if (apiKey) {
        headers["apikey"] = `${apiKey}`;
        headers["initiatorid"] = `${userId}`;
    }
    try {
        result = await fetch(`/spaces/${spaceId}/secrets`,
            {
                method: "POST",
                headers: headers
            });
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}

async function getAPIKeysMetadata(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets/keys`, "GET");
}

async function inviteSpaceCollaborators(spaceId, collaboratorEmails) {
    return await this.sendRequest(`/spaces/${spaceId}/collaborators`, "POST", {emails: collaboratorEmails});
}

async function unsubscribeFromObject(spaceId, objectId) {
    return await this.sendRequest(`/updates/unsubscribe/${spaceId}/${objectId}`, "GET");
}

async function subscribeToObject(spaceId, objectId) {
    return await this.sendRequest(`/updates/subscribe/${spaceId}/${objectId}`, "GET");
}

let delay = 1000;
const refreshDelay = 3000;
let objectsToRefresh = [];
let refreshTimeout;
let checkUpdatesTimeoutId;
let stopPolling = false;

function startCheckingUpdates(spaceId) {
    stopPolling = false;
    const bindCheckUpdates = checkUpdates.bind(this);
    bindCheckUpdates(spaceId);
}

async function checkUpdates(spaceId) {
    try {
        if (stopPolling) {
            return;
        }
        let data = await this.sendRequest(`/updates/${spaceId}`, "GET");
        if (data) {
            if (data.isSameUser) {
                notificationService.emit(data.targetObjectId);
            } else {
                objectsToRefresh.push(data.targetObjectId);
                if (!refreshTimeout) {
                    refreshTimeout = setTimeout(() => {
                        for (let objectId of objectsToRefresh) {
                            notificationService.emit(objectId);
                        }
                        objectsToRefresh = [];
                        refreshTimeout = null;
                    }, refreshDelay);
                }
            }
        }
    } catch (error) {
        console.error("Error fetching updates:", error);
    }
    if (!stopPolling) {
        checkUpdatesTimeoutId = setTimeout(() => {
            const bindCheckUpdates = checkUpdates.bind(this);
            bindCheckUpdates(spaceId);
        }, delay);
    }
}

function stopCheckingUpdates() {
    stopPolling = true;
    clearTimeout(checkUpdatesTimeoutId);
}
async function deleteImage(spaceId, imageId) {
    return await this.sendRequest(`/spaces/${spaceId}/images/${imageId}`, "DELETE");
}
module.exports = {
    createSpace,
    loadSpace,
    deleteSpace,
    storeSpace,
    addKeyToSpace,
    addSpaceChatMessage,
    addSpaceAnnouncement,
    getSpaceAnnouncement,
    getSpaceAnnouncements,
    updateSpaceAnnouncement,
    deleteSpaceAnnouncement,
    inviteSpaceCollaborators,
    subscribeToObject,
    unsubscribeFromObject,
    startCheckingUpdates,
    stopCheckingUpdates,
    sendRequest,
    getAPIKeysMetadata,
    deleteImage,
    Space,
    Announcement
}



