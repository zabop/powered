from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Query
from requests_oauthlib import OAuth2Session
from fastapi.responses import JSONResponse
import xml.etree.ElementTree as ET
import osmapi

app = FastAPI()

origins = ["https://zabop.github.io", "http://127.0.0.1:5173"]
user_whitelist = ["zabop"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/mark_nodes_as")
async def mark_nodes_as(request: Request, wayId: str = Query(...)):

    auth_header = request.headers.get("Authorization")
    token = {
        "access_token": auth_header.replace("Bearer ", ""),
        "token_type": "Bearer",
        "scope": ["write_api", "read_prefs"],
    }

    try:

        oauth_session = OAuth2Session(token=token)
        api = osmapi.OsmApi(api="https://api.openstreetmap.org", session=oauth_session)

        resp = oauth_session.get("https://api.openstreetmap.org/api/0.6/user/details")

        root = ET.fromstring(resp.content)
        user = root.find("user")
        changesets_elem = root.find(".//changesets")

        if user in user_whitelist:
            with api.Changeset({"comment": "mark nodes as power poles"}) as changeset:
                w = api.WayGet(int(wayId))
                for nodeId in w["nd"]:
                    node = api.NodeGet(nodeId)
                    node["tag"]["power"] = "pole"
                    api.NodeUpdate(node)
            resp = f"Marked all nodes of osm.org/way/{wayId} as power=pole"
        else:
            resp = "You are not on the whitelist to use this tool. You are more than welcome to be added to it, this is only a safeguard. Email zabop.github.io.subsystem611@passmail.com or add a PR: https://github.com/zabop/powered."
    except Exception as e:
        resp = e

    return JSONResponse({"message": resp})
