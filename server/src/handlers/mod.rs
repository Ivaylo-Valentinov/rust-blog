// use actix_web::{web, HttpRequest, HttpResponse, Result};

pub mod users;

// fn send_json(template: impl Template) -> HttpResponse {
//   match template.render() {
//       Ok(contents) => HttpResponse::Ok().body(contents),
//       Err(e)       => HttpResponse::InternalServerError().body(format!("{}", e)),
//   }
// }

// pub async fn send_error(request: HttpRequest) -> actix_web::Result<HttpResponse> {
//   NamedFile::open("static/404.html")?.
//       set_status_code(StatusCode::NOT_FOUND).
//       into_response(&request)
// }