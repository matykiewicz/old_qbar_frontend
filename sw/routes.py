from typing import Dict
from typing import Optional

from flask import Blueprint
from flask import Response
from flask import g
from flask import render_template

from qbartech_frontend.libs.route_scope import external_page


sw_bp = Blueprint(
    "sw",
    __name__,
    template_folder="templates",
    static_folder="../../static",
    url_prefix="/<country_code>",
)


@sw_bp.route("/app.js")
@external_page
def app() -> Response:
    js = render_template("app.js")
    response = Response(js, mimetype="text/javascript")
    return response


@sw_bp.route("/sw.js")
@external_page
def sw() -> Response:
    js = render_template("sw.js")
    response = Response(js, mimetype="text/javascript")
    response.headers["Cache-Control"] = "no-cache"
    return response


@sw_bp.route("/browserconfig.xml")
def browserconfig() -> Response:
    xml = render_template("browserconfig.xml")
    response = Response(xml, mimetype="text/xml")
    return response


@sw_bp.route("/site.webmanifest")
@external_page
def site_webmanifest() -> Response:
    json_ = render_template("site.webmanifest")
    response = Response(json_, mimetype="application/json")
    return response


@sw_bp.url_defaults
def add_country_code(_: Optional[str], values: Optional[Dict[str, str]]) -> None:
    if values is not None:
        values.setdefault("country_code", g.country_code)


@sw_bp.url_value_preprocessor
def pull_country_code(_: Optional[str], values: Optional[Dict[str, str]]) -> None:
    if values is not None:
        g.country_code = values.pop("country_code")
