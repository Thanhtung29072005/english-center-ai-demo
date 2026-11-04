# ENGLISH CENTER — JIRA BACKLOG

> Nguồn: `Dữ liệu Jira.xlsx` → sheet `Jira`, 128 issue. Đây là bản nhập liệu, KHÔNG phải bằng chứng code đã triển khai.
> Giữ nguyên `Issue key`, kiểu issue, `Parent key`, trạng thái và mô tả gốc. Mọi đổi trạng thái triển khai thực tế phải được xác minh từ source/test.

## Tổng quan
- **Epic:** 7; **Task:** 30; **Subtask:** 91
- **Trạng thái Jira khi export:** Done: 82; In Progress: 4; To Do: 39; READY FOR REVIEW: 2; READY FOR DEV: 1
- **Quy ước:** `Jira Status` là trạng thái lịch sử từ file; `Implementation Status` phải xác minh riêng.
- **Chú ý:** Parent của 7 Epic là `84` (không có issue key tương ứng trong file); các quan hệ Epic → Task → Subtask khác đều liên kết được.

## Cây Epic / Task / Subtask

### QLDA-71 — EPIC 0: Chuẩn bị và thiết lập dự án 

- Jira Status: `Done`

- **QLDA-318** [Task; Done] 0.1 Chuẩn bị yêu cầu, kiến trúc và kiểm thử dự án
  - QLDA-1 [Subtask; Done] 0.1 Khảo sát nghiệp vụ và viết SRS
  - QLDA-2 [Subtask; Done] 0.1 Thiết kế ERD tổng thể
  - QLDA-4 [Subtask; Done] 0.1 Wireframe các màn hình chính
  - QLDA-5 [Subtask; Done] 0.1 Chọn UI kit và setup Frontend
  - QLDA-6 [Subtask; Done] 0.1 Lập test plan và tiêu chí nghiệm thu
- **QLDA-3** [Task; Done] 0.3 Setup Jira, backlog và mã nguồn
- **QLDA-7** [Task; Done] PM Kickoff và phân công vai trò
  - QLDA-99 [Subtask; Done] Ước lượng, phân công và chốt phạm vi Kickoff, phân công vai trò và chốt kế hoạch Sprint 0
  - QLDA-98 [Subtask; Done] Chuẩn bị backlog, mục tiêu và dữ liệu cho Kickoff, phân công vai trò và chốt kế hoạch Sprint 0

### QLDA-72 — EPIC 1: Xác thực và quản lí chi nhánh

- Jira Status: `Done`

- **QLDA-8** [Task; Done] Sprint 1 Planning
  - QLDA-100 [Subtask; Done] Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning
  - QLDA-101 [Subtask; Done] Ước lượng, phân công và chốt phạm vi Planning
  - QLDA-102 [Subtask; Done] Cập nhật Jira, rủi ro và biên bản Planning
- **QLDA-319** [Task; Done] 1.1 Đăng ký, đăng nhập và phân quyền
  - QLDA-9 [Subtask; Done] 1.1 Đặc tả, wireframe đăng ký/đăng nhập và phân quyền
  - QLDA-10 [Subtask; Done] 1.1 Hoàn thiện users, API đăng ký/đăng nhập, JWT
  - QLDA-11 [Subtask; Done] 1.1 Giao diện đăng ký/đăng nhập và điều hướng theo vai trò
  - QLDA-12 [Subtask; Done] 1.1 Kiểm thử Auth, validate, token và phân quyền
  - QLDA-332 [Subtask; Done] 1.1 Review task
- **QLDA-320** [Task; Done] 1.2 Quản lý chi nhánh
  - QLDA-13 [Subtask; Done] 1.2 Đặc tả CRUD, tìm kiếm và ràng buộc chi nhánh
  - QLDA-14 [Subtask; Done] 1.2 API CRUD và tìm kiếm chi nhánh
  - QLDA-15 [Subtask; Done] 1.2 Giao diện danh sách, bộ lọc và form chi nhánh
  - QLDA-16 [Subtask; Done] 1.2 Kiểm thử CRUD và tìm kiếm chi nhánh
  - QLDA-333 [Subtask; Done] 1.2 Review task
- **QLDA-17** [Task; Done] Sprint 1 Review và chốt phạm vi Sprint 2
  - QLDA-133 [Subtask; Done] Tổ chức review hoặc demo Review, cập nhật Jira và chốt phạm vi Sprint 2
  - QLDA-132 [Subtask; Done] Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chốt phạm vi Sprint 2

### QLDA-73 — EPIC 2: Quản lý giáo viên và lớp học

- Jira Status: `Done`

- **QLDA-18** [Task; Done] Sprint 2 Planning
  - QLDA-134 [Subtask; Done] Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning
  - QLDA-136 [Subtask; Done] Cập nhật Jira, rủi ro và biên bản Planning
  - QLDA-135 [Subtask; Done] Ước lượng, phân công và chốt phạm vi Planning
- **QLDA-322** [Task; Done] 2.1 Quản lý giáo viên
  - QLDA-19 [Subtask; Done] 2.1 Đặc tả CRUD giáo viên, lọc theo chi nhánh và email duy nhất
  - QLDA-20 [Subtask; Done] 2.1 Hoàn thiện teachers; API CRUD và lấy giáo viên theo chi nhánh
  - QLDA-21 [Subtask; Done] 2.1 Giao diện danh sách, tìm kiếm, bộ lọc và form giáo viên
  - QLDA-22 [Subtask; Done] 2.1 Kiểm thử CRUD, hồ sơ và tìm kiếm giáo viên
  - QLDA-334 [Subtask; Done] 2.1 Review task
- **QLDA-323** [Task; Done] 2.2 Quản lý lớp học và phân công giáo viên
  - QLDA-23 [Subtask; Done] 2.2 Đặc tả quản lý lớp, phân công giáo viên và sĩ số
  - QLDA-24 [Subtask; Done] 2.2 Hoàn thiện classes/class_teachers; API CRUD và gán giáo viên
  - QLDA-25 [Subtask; Done] 2.2 Giao diện lớp học, bộ lọc và chức năng gán/xóa giáo viên
  - QLDA-26 [Subtask; Done] 2.2 Kiểm thử CRUD lớp, phân công giáo viên và sĩ số
  - QLDA-335 [Subtask; Done] 2.2 Review task
- **QLDA-27** [Task; Done] Sprint 2 Review, cập nhật Jira và chuẩn bị Sprint 3
  - QLDA-168 [Subtask; Done] Tổ chức review hoặc demo Review, cập nhật Jira và chuẩn bị Sprint 3
  - QLDA-167 [Subtask; Done] Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chuẩn bị Sprint 3

### QLDA-74 — EPIC 3: Đăng ký khóa học và duyệt học viên

- Jira Status: `Done`

- **QLDA-28** [Task; Done] Sprint 3 Planning
  - QLDA-169 [Subtask; Done] Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning
  - QLDA-170 [Subtask; Done] Ước lượng, phân công và chốt phạm vi Planning
  - QLDA-171 [Subtask; Done] Cập nhật Jira, rủi ro và biên bản Planning
- **QLDA-324** [Task; Done] 3.1 Đăng ký khóa học
  - QLDA-29 [Subtask; Done] 3.1 Đặc tả phụ huynh gửi yêu cầu đăng ký và xem lịch sử
  - QLDA-30 [Subtask; Done] 3.1 Hoàn thiện enrollment_requests; API đăng ký và lịch sử yêu cầu
  - QLDA-31 [Subtask; Done] 3.1 Giao diện khóa học, form đăng ký và lịch sử đăng ký
  - QLDA-32 [Subtask; Done] 3.1 Kiểm thử quy trình và điều kiện đăng ký khóa học
  - QLDA-336 [Subtask; Done] 3.2 Review task
- **QLDA-325** [Task; Done] 3.2 Duyệt học viên và xếp lớp
  - QLDA-33 [Subtask; Done] 3.2 Đặc tả duyệt/từ chối, tạo học viên và liên kết phụ huynh
  - QLDA-34 [Subtask; Done] 3.2 API duyệt/từ chối; tạo students, tài khoản và gán vào lớp
  - QLDA-35 [Subtask; Done] 3.2 Giao diện danh sách yêu cầu, lọc trạng thái, duyệt/từ chối
  - QLDA-36 [Subtask; Done] 3.2 Kiểm thử duyệt, từ chối, tạo hồ sơ và cập nhật trạng thái
  - QLDA-337 [Subtask; Done] 3.2 Review task
- **QLDA-37** [Task; Done] Sprint 3 Review, demo luồng tuyển sinh
  - QLDA-203 [Subtask; Done] Tổ chức review hoặc demo Review, demo luồng tuyển sinh
  - QLDA-202 [Subtask; Done] Tổng hợp kết quả và bằng chứng của Review, demo luồng tuyển sinh

### QLDA-75 — EPIC 4: Quản lý buổi học và nội dung học tập

- Jira Status: `In Progress`

- **QLDA-38** [Task; Done] Sprint 4 Planning
  - QLDA-204 [Subtask; Done] Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning
  - QLDA-205 [Subtask; Done] Ước lượng, phân công và chốt phạm vi Planning
  - QLDA-206 [Subtask; Done] Cập nhật Jira, rủi ro và biên bản Planning
- **QLDA-326** [Task; In Progress] 4.1 Quản lý buổi học, tài liệu và nhận xét
  - QLDA-39 [Subtask; Done] 4.1 Đặc tả buổi học, tài liệu, nhận xét và chấm điểm
  - QLDA-40 [Subtask; Done] 4.1 Hoàn thiện lessons/daily_comments; API buổi học và tài liệu
  - QLDA-41 [Subtask; READY FOR REVIEW] 4.1 Giao diện buổi học, upload tài liệu, nhận xét và điểm
  - QLDA-42 [Subtask; To Do] 4.1 Kiểm thử CRUD buổi học, lịch học và tài liệu
- **QLDA-327** [Task; To Do] 4.2 Học viên xem nội dung bài học
  - QLDA-43 [Subtask; READY FOR REVIEW] 4.2 Đặc tả học viên xem nội dung bài học theo lớp được phép
  - QLDA-44 [Subtask; To Do] 4.2 API lấy lớp, buổi học, từ vựng, bài tập và nhận xét
  - QLDA-45 [Subtask; To Do] 4.2 Giao diện danh sách và chi tiết nội dung bài học
  - QLDA-46 [Subtask; To Do] 4.2 Kiểm thử quyền truy cập và hiển thị nội dung bài học
- **QLDA-47** [Task; To Do] Sprint 4 Review, demo luồng dạy và học
  - QLDA-236 [Subtask; To Do] Tổng hợp kết quả và bằng chứng của Review, demo luồng dạy và học
  - QLDA-237 [Subtask; To Do] Tổ chức review hoặc demo Review, demo luồng dạy và học
  - QLDA-238 [Subtask; To Do] Ghi nhận phản hồi và cập nhật backlog sau Review, demo luồng dạy và học

### QLDA-76 — EPIC 5: Bài kiểm tra, làm bài và kết quả

- Jira Status: `In Progress`

- **QLDA-48** [Task; Done] Sprint 5 Planning
  - QLDA-241 [Subtask; Done] Cập nhật Jira, rủi ro và biên bản Planning
  - QLDA-239 [Subtask; Done] Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning
  - QLDA-240 [Subtask; Done] Ước lượng, phân công và chốt phạm vi Planning
- **QLDA-328** [Task; READY FOR DEV] 5.1 Quản lý bài kiểm tra và cấu hình đề
  - QLDA-49 [Subtask; Done] 5.1 Đặc tả tạo đề, câu hỏi/đáp án, trạng thái và nhập điểm
  - QLDA-50 [Subtask; To Do] 5.1 Hoàn thiện exams/questions/results; API quản lý bài kiểm tra
  - QLDA-51 [Subtask; To Do] 5.1 Giao diện quản lý đề, upload PDF, câu hỏi và bảng điểm
  - QLDA-52 [Subtask; To Do] 5.1 Kiểm thử CRUD bài kiểm tra, cấu hình đề và thời gian
- **QLDA-329** [Task; To Do] 5.2 Làm bài, nộp bài và chấm điểm
  - QLDA-53 [Subtask; To Do] 5.2 Đặc tả làm bài, tự nộp khi hết giờ và chấm tự động
  - QLDA-54 [Subtask; To Do] 5.2 API tải đề, lưu câu trả lời, nộp bài và chấm tự động
  - QLDA-55 [Subtask; To Do] 5.2 Giao diện làm bài, bộ đếm giờ, nộp bài và xem đáp án
  - QLDA-56 [Subtask; To Do] 5.2 Kiểm thử làm bài, tự nộp, chấm điểm và lưu kết quả
- **QLDA-330** [Task; To Do] 5.3 Phụ huynh xem kết quả học tập
  - QLDA-57 [Subtask; To Do] 5.3 Đặc tả phụ huynh xem điểm, kỹ năng và nhận xét của con
  - QLDA-58 [Subtask; To Do] 5.3 API kết quả theo học viên, bảo đảm đúng liên kết phụ huynh
  - QLDA-59 [Subtask; To Do] 5.3 Giao diện phụ huynh xem kết quả và nhận xét
  - QLDA-60 [Subtask; To Do] 5.3 Kiểm tra thử liên kết của phụ huynh học viên và nhận xét
- **QLDA-61** [Task; To Do] Sprint 5 Review, demo bài thi và kết quả
  - QLDA-288 [Subtask; To Do] Tổ chức review hoặc demo Review, demo bài thi và kết quả
  - QLDA-287 [Subtask; To Do] Tổng hợp kết quả và bằng chứng của Review, demo bài thi và kết quả
  - QLDA-289 [Subtask; To Do] Ghi nhận phản hồi và cập nhật backlog sau Review, demo bài thi và kết quả

### QLDA-77 — EPIC 6: Báo cáo, SIT, UAT và nghiệm thu

- Jira Status: `To Do`

- **QLDA-62** [Task; To Do] Sprint 6 Planning và kế hoạch SIT/UAT
  - QLDA-290 [Subtask; To Do] Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning và kế hoạch SIT/UAT
  - QLDA-291 [Subtask; To Do] Ước lượng, phân công và chốt phạm vi Planning và kế hoạch SIT/UAT
  - QLDA-292 [Subtask; To Do] Cập nhật Jira, rủi ro và biên bản Planning và kế hoạch SIT/UAT
- **QLDA-331** [Task; To Do] 6.1 Báo cáo và thống kê
  - QLDA-63 [Subtask; In Progress] 6.1 Quy định công thức doanh thu và ma trận quyền báo cáo
  - QLDA-64 [Subtask; To Do] 6.1 API tổng hợp học viên, doanh thu lớp/chi nhánh/toàn trung tâm
  - QLDA-65 [Subtask; To Do] 6.1 Dashboard thẻ tổng quan, biểu đồ và chi tiết doanh thu
  - QLDA-66 [Subtask; To Do] 6.1 Kiểm thử số liệu báo cáo và phân quyền tài chính
- **QLDA-67** [Task; To Do] 6.2 Chạy SIT end-to-end toàn bộ luồng nghiệp vụ cốt lõi
- **QLDA-68** [Task; To Do] 6.3 Sửa lỗi phát sinh từ SIT và kiểm thử hồi quy
- **QLDA-69** [Task; To Do] 6.4 Demo UAT, nghiệm thu và bàn giao tài liệu dự án
- **QLDA-70** [Task; To Do] Retrospective tổng kết dự án

## Chi tiết từng issue (mô tả gốc)

### QLDA-8 — Sprint 1 Planning

- **Type:** Task
- **Parent key:** `QLDA-72`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 1 Planning” trong Sprint 1.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-319 — 1.1 Đăng ký, đăng nhập và phân quyền

- **Type:** Task
- **Parent key:** `QLDA-72`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Đăng ký, đăng nhập và phân quyền”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái task cha theo kết quả thực tế.

---

### QLDA-318 — 0.1 Chuẩn bị yêu cầu, kiến trúc và kiểm thử dự án

- **Type:** Task
- **Parent key:** `QLDA-71`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Chuẩn bị yêu cầu, kiến trúc và kiểm thử dự án”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái task cha theo kết quả thực tế.

---

### QLDA-1 — 0.1 Khảo sát nghiệp vụ và viết SRS

- **Type:** Subtask
- **Parent key:** `QLDA-318`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Khảo sát nghiệp vụ, chọn module cốt lõi và viết SRS tổng quan” trong Sprint 0.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-2 — 0.1 Thiết kế ERD tổng thể

- **Type:** Subtask
- **Parent key:** `QLDA-318`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Thiết kế ERD tổng thể: users, branches, teachers, classes, students” trong Sprint 0.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-3 — 0.3 Setup Jira, backlog và mã nguồn

- **Type:** Task
- **Parent key:** `QLDA-71`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Setup Jira, workflow, backlog và quy ước quản lý mã nguồn” trong Sprint 0.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-4 — 0.1 Wireframe các màn hình chính

- **Type:** Subtask
- **Parent key:** `QLDA-318`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Wireframe các màn hình chính theo vai trò người dùng” trong Sprint 0.

Phạm vi:

* Làm rõ vai trò của người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và các điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-5 — 0.1 Chọn UI kit và setup Frontend

- **Type:** Subtask
- **Parent key:** `QLDA-318`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Chọn UI kit và setup khung dự án frontend” trong Sprint 0.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-6 — 0.1 Lập test plan và tiêu chí nghiệm thu

- **Type:** Subtask
- **Parent key:** `QLDA-318`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Lập test plan, tiêu chí nghiệm thu và dữ liệu kiểm thử” trong Sprint 0.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-7 — PM Kickoff và phân công vai trò

- **Type:** Task
- **Parent key:** `QLDA-71`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kickoff, phân công vai trò và chốt kế hoạch Sprint 0” trong Sprint 0.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-320 — 1.2 Quản lý chi nhánh

- **Type:** Task
- **Parent key:** `QLDA-72`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Quản lý chi nhánh”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái task cha theo kết quả thực tế.

---

### QLDA-9 — 1.1 Đặc tả, wireframe đăng ký/đăng nhập và phân quyền

- **Type:** Subtask
- **Parent key:** `QLDA-319`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả, wireframe Đăng ký/Đăng nhập và luồng phân quyền” trong Sprint 1.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-10 — 1.1 Hoàn thiện users, API đăng ký/đăng nhập, JWT

- **Type:** Subtask
- **Parent key:** `QLDA-319`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Hoàn thiện users; API đăng ký/đăng nhập, mã hóa mật khẩu, JWT” trong Sprint 1.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-11 — 1.1 Giao diện đăng ký/đăng nhập và điều hướng theo vai trò

- **Type:** Subtask
- **Parent key:** `QLDA-319`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện Đăng ký/Đăng nhập, validate và điều hướng theo vai trò” trong Sprint 1.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-12 — 1.1 Kiểm thử Auth, validate, token và phân quyền

- **Type:** Subtask
- **Parent key:** `QLDA-319`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Soạn và chạy test Auth, validate, token và phân quyền” trong Sprint 1.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-332 — 1.1 Review task

- **Type:** Subtask
- **Parent key:** `QLDA-319`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-13 — 1.2 Đặc tả CRUD, tìm kiếm và ràng buộc chi nhánh

- **Type:** Subtask
- **Parent key:** `QLDA-320`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả CRUD, tìm kiếm và ràng buộc dữ liệu chi nhánh” trong Sprint 1.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-14 — 1.2 API CRUD và tìm kiếm chi nhánh

- **Type:** Subtask
- **Parent key:** `QLDA-320`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Hoàn thiện branches/owners; API CRUD và tìm kiếm chi nhánh” trong Sprint 1.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-15 — 1.2 Giao diện danh sách, bộ lọc và form chi nhánh

- **Type:** Subtask
- **Parent key:** `QLDA-320`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện danh sách, bộ lọc và form CRUD chi nhánh” trong Sprint 1.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-16 — 1.2 Kiểm thử CRUD và tìm kiếm chi nhánh

- **Type:** Subtask
- **Parent key:** `QLDA-320`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử CRUD, tìm kiếm và ràng buộc chi nhánh” trong Sprint 1.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-333 — 1.2 Review task

- **Type:** Subtask
- **Parent key:** `QLDA-320`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-17 — Sprint 1 Review và chốt phạm vi Sprint 2

- **Type:** Task
- **Parent key:** `QLDA-72`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 1 Review, cập nhật Jira và chốt phạm vi Sprint 2” trong Sprint 1.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-18 — Sprint 2 Planning

- **Type:** Task
- **Parent key:** `QLDA-73`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 2 Planning” trong Sprint 2.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-322 — 2.1 Quản lý giáo viên

- **Type:** Task
- **Parent key:** `QLDA-73`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Quản lý giáo viên”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái Task cha theo kết quả thực tế.

---

### QLDA-323 — 2.2 Quản lý lớp học và phân công giáo viên

- **Type:** Task
- **Parent key:** `QLDA-73`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Quản lý lớp học và phân công giáo viên”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái Task cha theo kết quả thực tế.

---

### QLDA-19 — 2.1 Đặc tả CRUD giáo viên, lọc theo chi nhánh và email duy nhất

- **Type:** Subtask
- **Parent key:** `QLDA-322`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả CRUD giáo viên, lọc theo chi nhánh và email duy nhất” trong Sprint 2.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-23 — 2.2 Đặc tả quản lý lớp, phân công giáo viên và sĩ số

- **Type:** Subtask
- **Parent key:** `QLDA-323`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả quản lý lớp, phân công giáo viên và sĩ số” trong Sprint 2.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-20 — 2.1 Hoàn thiện teachers; API CRUD và lấy giáo viên theo chi nhánh

- **Type:** Subtask
- **Parent key:** `QLDA-322`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Hoàn thiện teachers; API CRUD và lấy giáo viên theo chi nhánh” trong Sprint 2.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-21 — 2.1 Giao diện danh sách, tìm kiếm, bộ lọc và form giáo viên

- **Type:** Subtask
- **Parent key:** `QLDA-322`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện danh sách, tìm kiếm, bộ lọc và form giáo viên” trong Sprint 2.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-28 — Sprint 3 Planning

- **Type:** Task
- **Parent key:** `QLDA-74`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 3 Planning” trong Sprint 3.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-324 — 3.1 Đăng ký khóa học

- **Type:** Task
- **Parent key:** `QLDA-74`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Đăng ký khóa học”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái task cha theo kết quả thực tế.

---

### QLDA-325 — 3.2 Duyệt học viên và xếp lớp

- **Type:** Task
- **Parent key:** `QLDA-74`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Duyệt học viên và xếp lớp”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái Task cha theo kết quả thực tế.

---

### QLDA-29 — 3.1 Đặc tả phụ huynh gửi yêu cầu đăng ký và xem lịch sử

- **Type:** Subtask
- **Parent key:** `QLDA-324`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả phụ huynh gửi yêu cầu đăng ký và xem lịch sử” trong Sprint 3.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-30 — 3.1 Hoàn thiện enrollment_requests; API đăng ký và lịch sử yêu cầu

- **Type:** Subtask
- **Parent key:** `QLDA-324`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Hoàn thiện enrollment_requests; API đăng ký và lịch sử yêu cầu” trong Sprint 3.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-31 — 3.1 Giao diện khóa học, form đăng ký và lịch sử đăng ký

- **Type:** Subtask
- **Parent key:** `QLDA-324`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện khóa học, form đăng ký và lịch sử đăng ký” trong Sprint 3.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-32 — 3.1 Kiểm thử quy trình và điều kiện đăng ký khóa học

- **Type:** Subtask
- **Parent key:** `QLDA-324`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử quy trình và điều kiện đăng ký khóa học” trong Sprint 3.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-336 — 3.2 Review task

- **Type:** Subtask
- **Parent key:** `QLDA-324`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-33 — 3.2 Đặc tả duyệt/từ chối, tạo học viên và liên kết phụ huynh

- **Type:** Subtask
- **Parent key:** `QLDA-325`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả duyệt/từ chối, tạo học viên và liên kết phụ huynh” trong Sprint 3.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-34 — 3.2 API duyệt/từ chối; tạo students, tài khoản và gán vào lớp

- **Type:** Subtask
- **Parent key:** `QLDA-325`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “API duyệt/từ chối; tạo students, tài khoản và gán vào lớp” trong Sprint 3.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-35 — 3.2 Giao diện danh sách yêu cầu, lọc trạng thái, duyệt/từ chối

- **Type:** Subtask
- **Parent key:** `QLDA-325`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện danh sách yêu cầu, lọc trạng thái, duyệt/từ chối” trong Sprint 3.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-36 — 3.2 Kiểm thử duyệt, từ chối, tạo hồ sơ và cập nhật trạng thái

- **Type:** Subtask
- **Parent key:** `QLDA-325`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử duyệt, từ chối, tạo hồ sơ và cập nhật trạng thái” trong Sprint 3.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-337 — 3.2 Review task

- **Type:** Subtask
- **Parent key:** `QLDA-325`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-37 — Sprint 3 Review, demo luồng tuyển sinh

- **Type:** Task
- **Parent key:** `QLDA-74`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 3 Review, demo luồng tuyển sinh” trong Sprint 3.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-22 — 2.1 Kiểm thử CRUD, hồ sơ và tìm kiếm giáo viên

- **Type:** Subtask
- **Parent key:** `QLDA-322`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử CRUD, hồ sơ và tìm kiếm giáo viên” trong Sprint 2.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-334 — 2.1 Review task

- **Type:** Subtask
- **Parent key:** `QLDA-322`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-24 — 2.2 Hoàn thiện classes/class_teachers; API CRUD và gán giáo viên

- **Type:** Subtask
- **Parent key:** `QLDA-323`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Hoàn thiện classes/class_teachers; API CRUD và gán giáo viên” trong Sprint 2.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-25 — 2.2 Giao diện lớp học, bộ lọc và chức năng gán/xóa giáo viên

- **Type:** Subtask
- **Parent key:** `QLDA-323`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện lớp học, bộ lọc và chức năng gán/xóa giáo viên” trong Sprint 2.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-26 — 2.2 Kiểm thử CRUD lớp, phân công giáo viên và sĩ số

- **Type:** Subtask
- **Parent key:** `QLDA-323`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử CRUD lớp, phân công giáo viên và sĩ số” trong Sprint 2.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-335 — 2.2 Review task

- **Type:** Subtask
- **Parent key:** `QLDA-323`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-27 — Sprint 2 Review, cập nhật Jira và chuẩn bị Sprint 3

- **Type:** Task
- **Parent key:** `QLDA-73`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 2 Review, cập nhật Jira và chuẩn bị Sprint 3” trong Sprint 2.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-38 — Sprint 4 Planning

- **Type:** Task
- **Parent key:** `QLDA-75`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 4 Planning” trong Sprint 4.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-326 — 4.1 Quản lý buổi học, tài liệu và nhận xét

- **Type:** Task
- **Parent key:** `QLDA-75`
- **Jira Status (export):** `In Progress`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Quản lý buổi học, tài liệu và nhận xét”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái Task cha theo kết quả thực tế.

---

### QLDA-327 — 4.2 Học viên xem nội dung bài học

- **Type:** Task
- **Parent key:** `QLDA-75`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Học viên xem nội dung bài học”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái task cha theo kết quả thực tế.

---

### QLDA-39 — 4.1 Đặc tả buổi học, tài liệu, nhận xét và chấm điểm

- **Type:** Subtask
- **Parent key:** `QLDA-326`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả buổi học, tài liệu, nhận xét và chấm điểm” trong Sprint 4.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-40 — 4.1 Hoàn thiện lessons/daily_comments; API buổi học và tài liệu

- **Type:** Subtask
- **Parent key:** `QLDA-326`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Hoàn thiện lessons/daily_comments; API buổi học và tài liệu” trong Sprint 4.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-41 — 4.1 Giao diện buổi học, upload tài liệu, nhận xét và điểm

- **Type:** Subtask
- **Parent key:** `QLDA-326`
- **Jira Status (export):** `READY FOR REVIEW`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện buổi học, upload tài liệu, nhận xét và điểm” trong Sprint 4.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-42 — 4.1 Kiểm thử CRUD buổi học, lịch học và tài liệu

- **Type:** Subtask
- **Parent key:** `QLDA-326`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử CRUD buổi học, lịch học và tài liệu” trong Sprint 4.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-43 — 4.2 Đặc tả học viên xem nội dung bài học theo lớp được phép

- **Type:** Subtask
- **Parent key:** `QLDA-327`
- **Jira Status (export):** `READY FOR REVIEW`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả học viên xem nội dung bài học theo lớp được phép” trong Sprint 4.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-44 — 4.2 API lấy lớp, buổi học, từ vựng, bài tập và nhận xét

- **Type:** Subtask
- **Parent key:** `QLDA-327`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “API lấy lớp, buổi học, từ vựng, bài tập và nhận xét” trong Sprint 4.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-45 — 4.2 Giao diện danh sách và chi tiết nội dung bài học

- **Type:** Subtask
- **Parent key:** `QLDA-327`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện danh sách và chi tiết nội dung bài học” trong Sprint 4.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-46 — 4.2 Kiểm thử quyền truy cập và hiển thị nội dung bài học

- **Type:** Subtask
- **Parent key:** `QLDA-327`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử quyền truy cập và hiển thị nội dung bài học” trong Sprint 4.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-47 — Sprint 4 Review, demo luồng dạy và học

- **Type:** Task
- **Parent key:** `QLDA-75`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 4 Review, demo luồng dạy và học” trong Sprint 4.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-48 — Sprint 5 Planning

- **Type:** Task
- **Parent key:** `QLDA-76`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 5 Planning” trong Sprint 5.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-328 — 5.1 Quản lý bài kiểm tra và cấu hình đề

- **Type:** Task
- **Parent key:** `QLDA-76`
- **Jira Status (export):** `READY FOR DEV`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Quản lý bài kiểm tra và cấu hình đề”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái Task cha theo kết quả thực tế.

---

### QLDA-329 — 5.2 Làm bài, nộp bài và chấm điểm

- **Type:** Task
- **Parent key:** `QLDA-76`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Làm bài, nộp bài và chấm điểm”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái task cha theo kết quả thực tế.

---

### QLDA-330 — 5.3 Phụ huynh xem kết quả học tập

- **Type:** Task
- **Parent key:** `QLDA-76`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Phụ huynh xem kết quả học tập”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái task cha theo kết quả thực tế.

---

### QLDA-49 — 5.1 Đặc tả tạo đề, câu hỏi/đáp án, trạng thái và nhập điểm

- **Type:** Subtask
- **Parent key:** `QLDA-328`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả tạo đề, câu hỏi/đáp án, trạng thái và nhập điểm” trong Sprint 5.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-50 — 5.1 Hoàn thiện exams/questions/results; API quản lý bài kiểm tra

- **Type:** Subtask
- **Parent key:** `QLDA-328`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Hoàn thiện exams/questions/results; API quản lý bài kiểm tra” trong Sprint 5.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-51 — 5.1 Giao diện quản lý đề, upload PDF, câu hỏi và bảng điểm

- **Type:** Subtask
- **Parent key:** `QLDA-328`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện quản lý đề, upload PDF, câu hỏi và bảng điểm” trong Sprint 5.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-52 — 5.1 Kiểm thử CRUD bài kiểm tra, cấu hình đề và thời gian

- **Type:** Subtask
- **Parent key:** `QLDA-328`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử CRUD bài kiểm tra, cấu hình đề và thời gian” trong Sprint 5.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-53 — 5.2 Đặc tả làm bài, tự nộp khi hết giờ và chấm tự động

- **Type:** Subtask
- **Parent key:** `QLDA-329`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả làm bài, tự nộp khi hết giờ và chấm tự động” trong Sprint 5.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-54 — 5.2 API tải đề, lưu câu trả lời, nộp bài và chấm tự động

- **Type:** Subtask
- **Parent key:** `QLDA-329`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “API tải đề, lưu câu trả lời, nộp bài và chấm tự động” trong Sprint 5.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-55 — 5.2 Giao diện làm bài, bộ đếm giờ, nộp bài và xem đáp án

- **Type:** Subtask
- **Parent key:** `QLDA-329`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện làm bài, bộ đếm giờ, nộp bài và xem đáp án” trong Sprint 5.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-56 — 5.2 Kiểm thử làm bài, tự nộp, chấm điểm và lưu kết quả

- **Type:** Subtask
- **Parent key:** `QLDA-329`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử làm bài, tự nộp, chấm điểm và lưu kết quả” trong Sprint 5.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-57 — 5.3 Đặc tả phụ huynh xem điểm, kỹ năng và nhận xét của con

- **Type:** Subtask
- **Parent key:** `QLDA-330`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Đặc tả phụ huynh xem điểm, kỹ năng và nhận xét của con” trong Sprint 5.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-58 — 5.3 API kết quả theo học viên, bảo đảm đúng liên kết phụ huynh

- **Type:** Subtask
- **Parent key:** `QLDA-330`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “API kết quả theo học viên, bảo đảm đúng liên kết phụ huynh” trong Sprint 5.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-59 — 5.3 Giao diện phụ huynh xem kết quả và nhận xét

- **Type:** Subtask
- **Parent key:** `QLDA-330`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Giao diện phụ huynh xem kết quả và nhận xét” trong Sprint 5.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-60 — 5.3 Kiểm tra thử liên kết của phụ huynh học viên và nhận xét

- **Type:** Subtask
- **Parent key:** `QLDA-330`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm tra thử liên kết của phụ huynh học viên và nhận xét” trong Sprint 5.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-61 — Sprint 5 Review, demo bài thi và kết quả

- **Type:** Task
- **Parent key:** `QLDA-76`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 5 Review, demo bài thi và kết quả” trong Sprint 5.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-62 — Sprint 6 Planning và kế hoạch SIT/UAT

- **Type:** Task
- **Parent key:** `QLDA-77`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sprint 6 Planning và kế hoạch SIT/UAT” trong Sprint 6.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-331 — 6.1 Báo cáo và thống kê

- **Type:** Task
- **Parent key:** `QLDA-77`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành nhóm chức năng “Báo cáo và thống kê”.

Cách thực hiện:
BA hoàn thiện yêu cầu và tiêu chí chấp nhận; BE xây dựng nghiệp vụ/API; FE xây dựng giao diện và tích hợp; TEST kiểm thử sớm theo từng phần. PM theo dõi bốn subtask và chỉ cập nhật trạng thái Task cha theo kết quả thực tế.

---

### QLDA-63 — 6.1 Quy định công thức doanh thu và ma trận quyền báo cáo

- **Type:** Subtask
- **Parent key:** `QLDA-331`
- **Jira Status (export):** `In Progress`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Quy định công thức doanh thu và ma trận quyền báo cáo” trong Sprint 6.

Phạm vi:

* Làm rõ vai trò người dùng, luồng chính và luồng ngoại lệ.
* Xác định dữ liệu, quy tắc nghiệp vụ và điều kiện kiểm tra.
* Cập nhật đặc tả/wireframe để BE, FE và Tester sử dụng.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-64 — 6.1 API tổng hợp học viên, doanh thu lớp/chi nhánh/toàn trung tâm

- **Type:** Subtask
- **Parent key:** `QLDA-331`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “API tổng hợp học viên, doanh thu lớp/chi nhánh/toàn trung tâm” trong Sprint 6.

Phạm vi:

* Hoàn thiện cấu trúc dữ liệu liên quan.
* Xây dựng API và kiểm tra dữ liệu đầu vào.
* Xử lý quyền truy cập, lỗi nghiệp vụ và tài liệu request/response.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-65 — 6.1 Dashboard thẻ tổng quan, biểu đồ và chi tiết doanh thu

- **Type:** Subtask
- **Parent key:** `QLDA-331`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Dashboard thẻ tổng quan, biểu đồ và chi tiết doanh thu” trong Sprint 6.

Phạm vi:

* Xây dựng giao diện theo đặc tả và wireframe.
* Tích hợp API, validate dữ liệu và hiển thị trạng thái/lỗi.
* Kiểm tra luồng thao tác trên các màn hình liên quan.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-66 — 6.1 Kiểm thử số liệu báo cáo và phân quyền tài chính

- **Type:** Subtask
- **Parent key:** `QLDA-331`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Kiểm thử số liệu báo cáo và phân quyền tài chính” trong Sprint 6.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-67 — 6.2 Chạy SIT end-to-end toàn bộ luồng nghiệp vụ cốt lõi

- **Type:** Task
- **Parent key:** `QLDA-77`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Chạy SIT end-to-end toàn bộ luồng nghiệp vụ cốt lõi” trong Sprint 6.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-68 — 6.3 Sửa lỗi phát sinh từ SIT và kiểm thử hồi quy

- **Type:** Task
- **Parent key:** `QLDA-77`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Sửa lỗi phát sinh từ SIT và kiểm thử hồi quy” trong Sprint 6.

Phạm vi:

* Chuẩn bị test case cho luồng đúng, sai và trường hợp biên.
* Thực thi kiểm thử, ghi nhận bằng chứng và tạo defect nếu có.
* Retest lỗi đã sửa và cập nhật kết quả kiểm thử.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-69 — 6.4 Demo UAT, nghiệm thu và bàn giao tài liệu dự án

- **Type:** Task
- **Parent key:** `QLDA-77`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Demo UAT, nghiệm thu và bàn giao tài liệu dự án” trong Sprint 6.

Phạm vi:

* Phối hợp hoàn thành công việc liên phòng vai trò.
* Ghi nhận kết quả, lỗi còn lại và tài liệu bàn giao.
* Xác nhận đầu ra đáp ứng tiêu chí nghiệm thu.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-70 — Retrospective tổng kết dự án

- **Type:** Task
- **Parent key:** `QLDA-77`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Hoàn thành công việc “Retrospective tổng kết dự án” trong Sprint 6.

Phạm vi:

* Thống nhất phạm vi, người phụ trách, thời hạn và tiêu chí hoàn thành.
* Cập nhật Jira, theo dõi rủi ro và ghi nhận quyết định của nhóm.
* Bảo đảm đầu ra của Sprint được rà soát trước khi chuyển bước.

Đầu ra:

* Sản phẩm/tài liệu của công việc được lưu trong kho dùng chung.
* Jira được cập nhật trạng thái, bằng chứng và kết quả thực hiện.

---

### QLDA-71 — EPIC 0: Chuẩn bị và thiết lập dự án

- **Type:** Epic
- **Parent key:** `84`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-72 — EPIC 1: Xác thực và quản lí chi nhánh

- **Type:** Epic
- **Parent key:** `84`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-73 — EPIC 2: Quản lý giáo viên và lớp học

- **Type:** Epic
- **Parent key:** `84`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-74 — EPIC 3: Đăng ký khóa học và duyệt học viên

- **Type:** Epic
- **Parent key:** `84`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-75 — EPIC 4: Quản lý buổi học và nội dung học tập

- **Type:** Epic
- **Parent key:** `84`
- **Jira Status (export):** `In Progress`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-76 — EPIC 5: Bài kiểm tra, làm bài và kết quả

- **Type:** Epic
- **Parent key:** `84`
- **Jira Status (export):** `In Progress`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-77 — EPIC 6: Báo cáo, SIT, UAT và nghiệm thu

- **Type:** Epic
- **Parent key:** `84`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

84

---

### QLDA-99 — Ước lượng, phân công và chốt phạm vi Kickoff, phân công vai trò và chốt kế hoạch Sprint 0

- **Type:** Subtask
- **Parent key:** `QLDA-7`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ước lượng, phân công và chốt phạm vi Kickoff, phân công vai trò và chốt kế hoạch Sprint 0

Công việc thực hiện:
- Thực hiện bước 2/2 của Task cha “Kickoff, phân công vai trò và chốt kế hoạch Sprint 0”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ước lượng, phân công và chốt phạm vi Kickoff, phân công vai trò và chốt kế hoạch Sprint 0”; kết quả được cập nhật trong Jira và liên kết với Task cha “Kickoff, phân công vai trò và chốt kế hoạch Sprint 0”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-100 — Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

- **Type:** Subtask
- **Parent key:** `QLDA-8`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 1 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 1 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-101 — Ước lượng, phân công và chốt phạm vi Planning

- **Type:** Subtask
- **Parent key:** `QLDA-8`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ước lượng, phân công và chốt phạm vi Planning

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 1 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ước lượng, phân công và chốt phạm vi Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 1 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-98 — Chuẩn bị backlog, mục tiêu và dữ liệu cho Kickoff, phân công vai trò và chốt kế hoạch Sprint 0

- **Type:** Subtask
- **Parent key:** `QLDA-7`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Chuẩn bị backlog, mục tiêu và dữ liệu cho Kickoff, phân công vai trò và chốt kế hoạch Sprint 0

Công việc thực hiện:
- Thực hiện bước 1/2 của Task cha “Kickoff, phân công vai trò và chốt kế hoạch Sprint 0”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Chuẩn bị backlog, mục tiêu và dữ liệu cho Kickoff, phân công vai trò và chốt kế hoạch Sprint 0”; kết quả được cập nhật trong Jira và liên kết với Task cha “Kickoff, phân công vai trò và chốt kế hoạch Sprint 0”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-133 — Tổ chức review hoặc demo Review, cập nhật Jira và chốt phạm vi Sprint 2

- **Type:** Subtask
- **Parent key:** `QLDA-17`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổ chức review hoặc demo Review, cập nhật Jira và chốt phạm vi Sprint 2

Công việc thực hiện:
- Thực hiện bước 2/2 của Task cha “Sprint 1 Review, cập nhật Jira và chốt phạm vi Sprint 2”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổ chức review hoặc demo Review, cập nhật Jira và chốt phạm vi Sprint 2”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 1 Review, cập nhật Jira và chốt phạm vi Sprint 2”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-102 — Cập nhật Jira, rủi ro và biên bản Planning

- **Type:** Subtask
- **Parent key:** `QLDA-8`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Cập nhật Jira, rủi ro và biên bản Planning

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 1 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Cập nhật Jira, rủi ro và biên bản Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 1 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-132 — Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chốt phạm vi Sprint 2

- **Type:** Subtask
- **Parent key:** `QLDA-17`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chốt phạm vi Sprint 2

Công việc thực hiện:
- Thực hiện bước 1/2 của Task cha “Sprint 1 Review, cập nhật Jira và chốt phạm vi Sprint 2”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chốt phạm vi Sprint 2”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 1 Review, cập nhật Jira và chốt phạm vi Sprint 2”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-134 — Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

- **Type:** Subtask
- **Parent key:** `QLDA-18`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 2 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 2 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-136 — Cập nhật Jira, rủi ro và biên bản Planning

- **Type:** Subtask
- **Parent key:** `QLDA-18`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Cập nhật Jira, rủi ro và biên bản Planning

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 2 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Cập nhật Jira, rủi ro và biên bản Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 2 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-135 — Ước lượng, phân công và chốt phạm vi Planning

- **Type:** Subtask
- **Parent key:** `QLDA-18`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ước lượng, phân công và chốt phạm vi Planning

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 2 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ước lượng, phân công và chốt phạm vi Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 2 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-168 — Tổ chức review hoặc demo Review, cập nhật Jira và chuẩn bị Sprint 3

- **Type:** Subtask
- **Parent key:** `QLDA-27`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổ chức review hoặc demo Review, cập nhật Jira và chuẩn bị Sprint 3

Công việc thực hiện:
- Thực hiện bước 2/2 của Task cha “Sprint 2 Review, cập nhật Jira và chuẩn bị Sprint 3”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổ chức review hoặc demo Review, cập nhật Jira và chuẩn bị Sprint 3”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 2 Review, cập nhật Jira và chuẩn bị Sprint 3”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-203 — Tổ chức review hoặc demo Review, demo luồng tuyển sinh

- **Type:** Subtask
- **Parent key:** `QLDA-37`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổ chức review hoặc demo Review, demo luồng tuyển sinh

Công việc thực hiện:
- Thực hiện bước 2/2 của Task cha “Sprint 3 Review, demo luồng tuyển sinh”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổ chức review hoặc demo Review, demo luồng tuyển sinh”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 3 Review, demo luồng tuyển sinh”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-167 — Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chuẩn bị Sprint 3

- **Type:** Subtask
- **Parent key:** `QLDA-27`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chuẩn bị Sprint 3

Công việc thực hiện:
- Thực hiện bước 1/2 của Task cha “Sprint 2 Review, cập nhật Jira và chuẩn bị Sprint 3”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổng hợp kết quả và bằng chứng của Review, cập nhật Jira và chuẩn bị Sprint 3”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 2 Review, cập nhật Jira và chuẩn bị Sprint 3”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-169 — Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

- **Type:** Subtask
- **Parent key:** `QLDA-28`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 3 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 3 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-170 — Ước lượng, phân công và chốt phạm vi Planning

- **Type:** Subtask
- **Parent key:** `QLDA-28`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ước lượng, phân công và chốt phạm vi Planning

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 3 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ước lượng, phân công và chốt phạm vi Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 3 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-171 — Cập nhật Jira, rủi ro và biên bản Planning

- **Type:** Subtask
- **Parent key:** `QLDA-28`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Cập nhật Jira, rủi ro và biên bản Planning

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 3 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Cập nhật Jira, rủi ro và biên bản Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 3 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-202 — Tổng hợp kết quả và bằng chứng của Review, demo luồng tuyển sinh

- **Type:** Subtask
- **Parent key:** `QLDA-37`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổng hợp kết quả và bằng chứng của Review, demo luồng tuyển sinh

Công việc thực hiện:
- Thực hiện bước 1/2 của Task cha “Sprint 3 Review, demo luồng tuyển sinh”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổng hợp kết quả và bằng chứng của Review, demo luồng tuyển sinh”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 3 Review, demo luồng tuyển sinh”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-236 — Tổng hợp kết quả và bằng chứng của Review, demo luồng dạy và học

- **Type:** Subtask
- **Parent key:** `QLDA-47`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổng hợp kết quả và bằng chứng của Review, demo luồng dạy và học

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 4 Review, demo luồng dạy và học”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổng hợp kết quả và bằng chứng của Review, demo luồng dạy và học”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 4 Review, demo luồng dạy và học”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-241 — Cập nhật Jira, rủi ro và biên bản Planning

- **Type:** Subtask
- **Parent key:** `QLDA-48`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Cập nhật Jira, rủi ro và biên bản Planning

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 5 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Cập nhật Jira, rủi ro và biên bản Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 5 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-237 — Tổ chức review hoặc demo Review, demo luồng dạy và học

- **Type:** Subtask
- **Parent key:** `QLDA-47`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổ chức review hoặc demo Review, demo luồng dạy và học

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 4 Review, demo luồng dạy và học”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổ chức review hoặc demo Review, demo luồng dạy và học”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 4 Review, demo luồng dạy và học”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-204 — Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

- **Type:** Subtask
- **Parent key:** `QLDA-38`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 4 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 4 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-205 — Ước lượng, phân công và chốt phạm vi Planning

- **Type:** Subtask
- **Parent key:** `QLDA-38`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ước lượng, phân công và chốt phạm vi Planning

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 4 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ước lượng, phân công và chốt phạm vi Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 4 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-206 — Cập nhật Jira, rủi ro và biên bản Planning

- **Type:** Subtask
- **Parent key:** `QLDA-38`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Cập nhật Jira, rủi ro và biên bản Planning

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 4 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Cập nhật Jira, rủi ro và biên bản Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 4 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-238 — Ghi nhận phản hồi và cập nhật backlog sau Review, demo luồng dạy và học

- **Type:** Subtask
- **Parent key:** `QLDA-47`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ghi nhận phản hồi và cập nhật backlog sau Review, demo luồng dạy và học

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 4 Review, demo luồng dạy và học”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ghi nhận phản hồi và cập nhật backlog sau Review, demo luồng dạy và học”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 4 Review, demo luồng dạy và học”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-239 — Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

- **Type:** Subtask
- **Parent key:** `QLDA-48`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 5 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 5 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-240 — Ước lượng, phân công và chốt phạm vi Planning

- **Type:** Subtask
- **Parent key:** `QLDA-48`
- **Jira Status (export):** `Done`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ước lượng, phân công và chốt phạm vi Planning

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 5 Planning”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ước lượng, phân công và chốt phạm vi Planning”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 5 Planning”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-288 — Tổ chức review hoặc demo Review, demo bài thi và kết quả

- **Type:** Subtask
- **Parent key:** `QLDA-61`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổ chức review hoặc demo Review, demo bài thi và kết quả

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 5 Review, demo bài thi và kết quả”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổ chức review hoặc demo Review, demo bài thi và kết quả”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 5 Review, demo bài thi và kết quả”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-290 — Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning và kế hoạch SIT/UAT

- **Type:** Subtask
- **Parent key:** `QLDA-62`
- **Jira Status (export):** `To Do`
- **Priority:** `High`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning và kế hoạch SIT/UAT

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 6 Planning và kế hoạch SIT/UAT”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Chuẩn bị backlog, mục tiêu và dữ liệu cho Planning và kế hoạch SIT/UAT”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 6 Planning và kế hoạch SIT/UAT”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-291 — Ước lượng, phân công và chốt phạm vi Planning và kế hoạch SIT/UAT

- **Type:** Subtask
- **Parent key:** `QLDA-62`
- **Jira Status (export):** `To Do`
- **Priority:** `High`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ước lượng, phân công và chốt phạm vi Planning và kế hoạch SIT/UAT

Công việc thực hiện:
- Thực hiện bước 2/3 của Task cha “Sprint 6 Planning và kế hoạch SIT/UAT”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ước lượng, phân công và chốt phạm vi Planning và kế hoạch SIT/UAT”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 6 Planning và kế hoạch SIT/UAT”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-292 — Cập nhật Jira, rủi ro và biên bản Planning và kế hoạch SIT/UAT

- **Type:** Subtask
- **Parent key:** `QLDA-62`
- **Jira Status (export):** `To Do`
- **Priority:** `High`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Cập nhật Jira, rủi ro và biên bản Planning và kế hoạch SIT/UAT

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 6 Planning và kế hoạch SIT/UAT”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Cập nhật Jira, rủi ro và biên bản Planning và kế hoạch SIT/UAT”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 6 Planning và kế hoạch SIT/UAT”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-287 — Tổng hợp kết quả và bằng chứng của Review, demo bài thi và kết quả

- **Type:** Subtask
- **Parent key:** `QLDA-61`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Tổng hợp kết quả và bằng chứng của Review, demo bài thi và kết quả

Công việc thực hiện:
- Thực hiện bước 1/3 của Task cha “Sprint 5 Review, demo bài thi và kết quả”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Tổng hợp kết quả và bằng chứng của Review, demo bài thi và kết quả”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 5 Review, demo bài thi và kết quả”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---

### QLDA-289 — Ghi nhận phản hồi và cập nhật backlog sau Review, demo bài thi và kết quả

- **Type:** Subtask
- **Parent key:** `QLDA-61`
- **Jira Status (export):** `To Do`
- **Priority:** `Medium`
- **Implementation Status:** `UNVERIFIED`

**Jira Description (nguyên nội dung):**

Mục tiêu:
Ghi nhận phản hồi và cập nhật backlog sau Review, demo bài thi và kết quả

Công việc thực hiện:
- Thực hiện bước 3/3 của Task cha “Sprint 5 Review, demo bài thi và kết quả”.
- Cập nhật tiến độ, kết quả và bằng chứng trên Jira hoặc kho tài liệu chung.
- Báo ngay cho PM nếu có blocker hoặc thay đổi phạm vi.

Đầu ra: Jira, kế hoạch/biên bản, phân công, rủi ro và quyết định được cập nhật.

Tiêu chí nghiệm thu:

Hoàn thành “Ghi nhận phản hồi và cập nhật backlog sau Review, demo bài thi và kết quả”; kết quả được cập nhật trong Jira và liên kết với Task cha “Sprint 5 Review, demo bài thi và kết quả”. Phạm vi, người phụ trách, thời hạn, rủi ro và quyết định phải được ghi nhận; Jira và biên bản được cập nhật.

---
