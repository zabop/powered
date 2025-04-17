from fastapi.middleware.cors import CORSMiddleware
from requests_oauthlib import OAuth2Session
from fastapi import FastAPI, HTTPException
from oauthcli import OpenStreetMapAuth
import xml.etree.ElementTree as ET
from pydantic import BaseModel
import osmapi

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["POST"],
)


class TokenRequest(BaseModel):
    access_token: str


@app.post("/mark_nodes_as")
async def mark_nodes_as(token_request: TokenRequest):
    try:

        token = {
            "access_token": token_request.access_token,
            "token_type": "Bearer",
            "scope": ["write_api", "read_prefs"],
        }

        oauth_session = OAuth2Session(token=token)
        api = osmapi.OsmApi(api="https://api.openstreetmap.org", session=oauth_session)

        resp = oauth_session.get("https://api.openstreetmap.org/api/0.6/user/details")

        root = ET.fromstring(resp.content)
        user_elem = root.find("user")
        changesets_elem = root.find(".//changesets")

        response_data = {
            "display_name": user_elem.attrib.get("display_name"),
            "account_created": user_elem.attrib.get("account_created"),
            "changeset_count": changesets_elem.attrib.get("count"),
        }

        return response_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
