# Feature Specification: Digital Library Forum Backend

**Feature Branch**: `001-digital-library-forum`

**Created**: 2026-05-30

**Status**: Draft

**Input**: User description: "Xây dựng backend cho hệ thống thư viện số thông minh tích hợp diễn đàn học thuật dành cho trường học nhằm hỗ trợ quản lý, chia sẻ và khai thác tài liệu học tập cũng như tạo môi trường trao đổi học thuật giữa sinh viên và giảng viên."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Khách truy cập và bắt đầu sử dụng hệ thống (Priority: P1)

Khách có thể đăng ký tài khoản, đăng nhập, tìm kiếm tài liệu công khai và xem thông
tin chi tiết của tài liệu công khai trước khi tham gia đầy đủ vào hệ thống.

**Why this priority**: Đây là cửa vào của toàn bộ hệ thống; nếu khách không thể tìm
kiếm, xem tài liệu công khai hoặc tạo tài khoản thì các luồng học tập tiếp theo
không thể diễn ra.

**Independent Test**: Có thể kiểm thử bằng cách tạo một tài khoản mới, đăng nhập
thành công, tìm kiếm tài liệu công khai và xem chi tiết một tài liệu đã được công
khai.

**Acceptance Scenarios**:

1. **Given** khách chưa có tài khoản, **When** khách gửi thông tin đăng ký hợp lệ,
   **Then** hệ thống tạo tài khoản ở trạng thái có thể đăng nhập.
2. **Given** khách nhập thông tin đăng nhập đúng và tài khoản không bị khóa,
   **When** khách đăng nhập, **Then** hệ thống cho phép truy cập theo vai trò của
   tài khoản đó.
3. **Given** có tài liệu đã được công khai, **When** khách tìm kiếm theo từ khóa phù
   hợp, **Then** hệ thống trả về danh sách tài liệu công khai liên quan.
4. **Given** khách đang xem kết quả tìm kiếm, **When** khách chọn một tài liệu công
   khai, **Then** hệ thống hiển thị thông tin chi tiết được phép xem công khai.

---

### User Story 2 - Sinh viên khai thác tài liệu và tham gia học thuật (Priority: P1)

Sinh viên có thể xem tài liệu trên dashboard, tìm kiếm và lọc tài liệu, xem chi tiết,
đọc trực tuyến, tải tài liệu, lưu hoặc bỏ lưu tài liệu yêu thích, đánh giá tài liệu,
tham gia diễn đàn, báo cáo vi phạm, tham gia nhóm học tập và quản lý hồ sơ cá nhân.

**Why this priority**: Sinh viên là người dùng chính của hệ thống; khả năng khai thác
tài liệu và trao đổi học thuật là giá trị cốt lõi của sản phẩm.

**Independent Test**: Có thể kiểm thử bằng một tài khoản sinh viên đã đăng nhập:
tìm tài liệu đã duyệt, đọc hoặc tải tài liệu, lưu yêu thích, đánh giá, đăng bài diễn
đàn, bình luận và tham gia một nhóm học tập.

**Acceptance Scenarios**:

1. **Given** sinh viên đã đăng nhập, **When** sinh viên mở dashboard tài liệu,
   **Then** hệ thống hiển thị các tài liệu được phép xem.
2. **Given** sinh viên đã đăng nhập, **When** sinh viên lọc tài liệu theo tiêu chí,
   **Then** hệ thống trả về danh sách phù hợp với bộ lọc.
3. **Given** sinh viên đã đăng nhập và tài liệu được phép tải, **When** sinh viên yêu
   cầu tải tài liệu, **Then** hệ thống cho phép tải và ghi nhận thao tác quan trọng
   nếu thuộc nhóm cần kiểm tra.
4. **Given** sinh viên đã đăng nhập, **When** sinh viên lưu hoặc bỏ lưu tài liệu,
   **Then** danh sách yêu thích của sinh viên được cập nhật chính xác.
5. **Given** sinh viên đã đăng nhập, **When** sinh viên đăng bài, bình luận hoặc báo
   cáo nội dung vi phạm, **Then** hệ thống ghi nhận nội dung hoặc báo cáo theo đúng
   trạng thái xử lý ban đầu.
6. **Given** sinh viên là thành viên nhóm học tập, **When** sinh viên xem hoặc tải tài
   liệu nhóm, đăng bài hoặc bình luận trong nhóm, **Then** hệ thống chỉ cho phép các
   thao tác phù hợp với quyền trong nhóm.

---

### User Story 3 - Giảng viên chia sẻ tài liệu và dẫn dắt học thuật (Priority: P1)

Giảng viên có thể đăng tải, cập nhật, ẩn hoặc xóa tài liệu của mình, theo dõi trạng
thái duyệt, tham gia diễn đàn, trả lời sinh viên, báo cáo vi phạm, tạo nhóm học tập,
quản lý thành viên, cấu hình quyền tham gia nhóm và đăng tài liệu hoặc bài thảo luận
trong nhóm.

**Why this priority**: Giảng viên tạo nguồn tài liệu và hoạt động học thuật chính,
đồng thời hỗ trợ chất lượng trao đổi của sinh viên.

**Independent Test**: Có thể kiểm thử bằng một tài khoản giảng viên: đăng tài liệu,
kiểm tra trạng thái chờ duyệt, cập nhật tài liệu, tạo nhóm học tập, thêm thành viên
và đăng nội dung trong nhóm.

**Acceptance Scenarios**:

1. **Given** giảng viên đã đăng nhập, **When** giảng viên đăng tải tài liệu hợp lệ,
   **Then** tài liệu được tạo ở trạng thái chờ duyệt và chưa hiển thị công khai.
2. **Given** giảng viên là chủ sở hữu tài liệu, **When** giảng viên cập nhật, ẩn hoặc
   xóa tài liệu, **Then** hệ thống chỉ áp dụng thay đổi cho tài liệu thuộc quyền sở
   hữu của giảng viên đó.
3. **Given** giảng viên đã đăng nhập, **When** giảng viên xem danh sách tài liệu đã
   đăng, **Then** hệ thống hiển thị trạng thái duyệt hiện tại của từng tài liệu.
4. **Given** giảng viên tạo nhóm học tập, **When** giảng viên cấu hình quyền tham gia
   và quản lý thành viên, **Then** hệ thống áp dụng quyền nhóm cho việc xem, tải và
   đăng nội dung trong nhóm.

---

### User Story 4 - Quản trị nội dung kiểm duyệt tài liệu và thảo luận (Priority: P2)

Quản trị nội dung có thể xem danh sách tài liệu chờ duyệt, kiểm tra nội dung, phê
duyệt hoặc từ chối kèm lý do, quản lý nội dung diễn đàn, xóa bài viết hoặc bình luận
vi phạm, khóa chủ đề, tiếp nhận báo cáo vi phạm và cập nhật trạng thái xử lý báo cáo.

**Why this priority**: Kiểm duyệt bảo đảm chỉ nội dung phù hợp được công khai và các
báo cáo vi phạm được xử lý có trách nhiệm.

**Independent Test**: Có thể kiểm thử bằng một tài khoản quản trị nội dung: xử lý một
tài liệu chờ duyệt, từ chối một tài liệu với lý do, xóa một bình luận vi phạm và cập
nhật trạng thái một báo cáo.

**Acceptance Scenarios**:

1. **Given** có tài liệu chờ duyệt, **When** quản trị nội dung phê duyệt tài liệu,
   **Then** tài liệu trở thành công khai và xuất hiện trong kết quả được phép hiển
   thị.
2. **Given** có tài liệu chờ duyệt, **When** quản trị nội dung từ chối tài liệu,
   **Then** hệ thống yêu cầu lý do từ chối và lưu lý do cùng trạng thái từ chối.
3. **Given** có báo cáo vi phạm từ sinh viên hoặc giảng viên, **When** quản trị nội
   dung xử lý báo cáo, **Then** hệ thống cập nhật trạng thái xử lý và ghi nhận kết
   quả.
4. **Given** có chủ đề, bài viết hoặc bình luận vi phạm, **When** quản trị nội dung
   xóa nội dung hoặc khóa chủ đề, **Then** người dùng thường không còn có thể tiếp tục
   tương tác với nội dung bị xử lý.

---

### User Story 5 - Quản trị viên vận hành và phân quyền hệ thống (Priority: P2)

Quản trị viên có thể quản lý người dùng, tìm kiếm và xem thông tin tài khoản, khóa
hoặc mở khóa tài khoản, cập nhật trạng thái tài khoản, phân quyền người dùng, cấu
hình hệ thống và xem thống kê tổng thể.

**Why this priority**: Hệ thống cần khả năng vận hành, kiểm soát tài khoản và phân
quyền để bảo vệ dữ liệu và duy trì hoạt động ổn định.

**Independent Test**: Có thể kiểm thử bằng một tài khoản quản trị viên: tìm kiếm tài
khoản, khóa tài khoản, xác nhận tài khoản bị khóa không thể đăng nhập, mở khóa lại,
phân quyền và xem thống kê tổng thể.

**Acceptance Scenarios**:

1. **Given** quản trị viên đã đăng nhập, **When** quản trị viên tìm kiếm tài khoản,
   **Then** hệ thống trả về thông tin tài khoản phù hợp với điều kiện tìm kiếm.
2. **Given** một tài khoản đang hoạt động, **When** quản trị viên khóa tài khoản,
   **Then** tài khoản đó không thể đăng nhập cho đến khi được mở khóa.
3. **Given** quản trị viên phân quyền người dùng, **When** quyền được cập nhật,
   **Then** các chức năng được phép và bị cấm của người dùng phản ánh quyền mới.
4. **Given** hệ thống có dữ liệu hoạt động, **When** quản trị viên xem thống kê tổng
   thể, **Then** hệ thống hiển thị các chỉ số vận hành chính.

### Edge Cases

- Tài khoản bị khóa cố gắng đăng nhập.
- Người dùng chưa đăng nhập cố tải tài liệu, tham gia thảo luận, tham gia nhóm hoặc
  cập nhật hồ sơ.
- Tài liệu chưa được duyệt hoặc bị từ chối xuất hiện trong tìm kiếm công khai.
- Quản trị nội dung từ chối tài liệu nhưng không nhập lý do.
- Người dùng không phải chủ sở hữu cố cập nhật, ẩn hoặc xóa tài liệu của giảng viên
  khác.
- Sinh viên hoặc giảng viên báo cáo cùng một nội dung nhiều lần.
- Người dùng cố truy cập tài liệu hoặc nội dung của nhóm học tập mà họ chưa được phép
  tham gia.
- Chủ đề thảo luận đã bị khóa nhận thêm bài trả lời hoặc bình luận mới.
- Quản trị nội dung cố xử lý lại một báo cáo đã được đóng.
- Quản trị viên cố thu hồi quyền cuối cùng cần thiết để vẫn còn ít nhất một người có
  thể quản trị hệ thống.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST hỗ trợ đăng ký tài khoản cho khách với thông tin hợp lệ
  và từ chối thông tin không hợp lệ.
- **FR-002**: Hệ thống MUST cho phép người dùng đăng nhập khi thông tin xác thực đúng
  và tài khoản không bị khóa.
- **FR-003**: Hệ thống MUST từ chối đăng nhập đối với tài khoản bị khóa.
- **FR-004**: Khách MUST có thể tìm kiếm và xem thông tin tài liệu công khai.
- **FR-005**: Hệ thống MUST chỉ hiển thị công khai các tài liệu đã được phê duyệt.
- **FR-006**: Người dùng MUST đăng nhập trước khi tải tài liệu, tham gia thảo luận,
  tham gia nhóm học tập hoặc cập nhật hồ sơ cá nhân.
- **FR-007**: Sinh viên MUST có thể xem dashboard tài liệu, tìm kiếm, lọc, xem chi
  tiết, đọc trực tuyến và tải các tài liệu được phép.
- **FR-008**: Sinh viên MUST có thể lưu, bỏ lưu và đánh giá tài liệu được phép xem.
- **FR-009**: Sinh viên MUST có thể xem bài viết diễn đàn, đăng bài thảo luận, bình
  luận bài viết và báo cáo bài viết hoặc bình luận vi phạm.
- **FR-010**: Sinh viên MUST có thể tham gia nhóm học tập theo quyền tham gia của
  nhóm, xem và tải tài liệu nhóm, đăng bài và bình luận trong nhóm.
- **FR-011**: Sinh viên và giảng viên MUST có thể cập nhật hồ sơ cá nhân và đổi mật
  khẩu sau khi đăng nhập.
- **FR-012**: Giảng viên MUST có thể đăng tải tài liệu, cập nhật tài liệu đã đăng,
  ẩn hoặc xóa tài liệu thuộc sở hữu của mình.
- **FR-013**: Tài liệu do giảng viên đăng tải MUST được tạo ở trạng thái chờ duyệt
  trước khi có thể công khai.
- **FR-014**: Giảng viên MUST có thể theo dõi trạng thái duyệt của tài liệu do mình
  đăng.
- **FR-015**: Giảng viên MUST có thể đăng chủ đề thảo luận, trả lời câu hỏi của sinh
  viên và báo cáo nội dung vi phạm.
- **FR-016**: Giảng viên MUST có thể tạo nhóm học tập, quản lý thành viên, thiết lập
  quyền tham gia, đăng tài liệu vào nhóm và tạo bài thảo luận trong nhóm.
- **FR-017**: Quản trị nội dung MUST có thể xem danh sách tài liệu chờ duyệt và kiểm
  tra thông tin tài liệu trước khi quyết định.
- **FR-018**: Quản trị nội dung MUST có thể phê duyệt tài liệu chờ duyệt.
- **FR-019**: Quản trị nội dung MUST có thể từ chối tài liệu chờ duyệt, và mỗi lần
  từ chối MUST có lý do cụ thể.
- **FR-020**: Quản trị nội dung MUST có thể xóa bài viết hoặc bình luận vi phạm và
  khóa chủ đề thảo luận khi cần.
- **FR-021**: Sinh viên và giảng viên MUST có thể gửi báo cáo nội dung vi phạm.
- **FR-022**: Mọi báo cáo vi phạm MUST được chuyển đến hàng đợi xử lý của quản trị
  nội dung.
- **FR-023**: Quản trị nội dung MUST có thể cập nhật trạng thái xử lý báo cáo và kết
  quả xử lý.
- **FR-024**: Quản trị viên MUST có thể quản lý người dùng, tìm kiếm và xem thông tin
  tài khoản, khóa hoặc mở khóa tài khoản, và cập nhật trạng thái tài khoản.
- **FR-025**: Chỉ quản trị viên MUST có quyền phân quyền người dùng.
- **FR-026**: Chỉ quản trị viên MUST có quyền cấu hình hệ thống.
- **FR-027**: Quản trị viên MUST có thể xem thống kê tổng thể về người dùng, tài liệu,
  diễn đàn, nhóm học tập, báo cáo và hoạt động kiểm duyệt.
- **FR-028**: Hệ thống MUST ghi nhận các thao tác quan trọng gồm đăng tải tài liệu,
  duyệt tài liệu, xử lý báo cáo, khóa tài khoản và phân quyền.
- **FR-029**: Hệ thống MUST kiểm tra quyền truy cập trước khi cho phép thao tác trên
  tài liệu, bài viết, bình luận, nhóm học tập, báo cáo, tài khoản hoặc cấu hình hệ
  thống.
- **FR-030**: Hệ thống MUST kiểm tra dữ liệu đầu vào cho các luồng đăng ký, đăng
  nhập, đổi mật khẩu, cập nhật hồ sơ, đăng tài liệu, duyệt tài liệu, tạo bài viết,
  bình luận, báo cáo vi phạm, tạo nhóm và phân quyền.

### Key Entities *(include if feature involves data)*

- **User**: Người dùng hệ thống, gồm khách đã đăng ký, sinh viên, giảng viên, quản trị
  nội dung và quản trị viên; có trạng thái tài khoản, thông tin hồ sơ và vai trò.
- **Role**: Nhóm quyền xác định các chức năng người dùng được phép thực hiện.
- **Document**: Tài liệu học tập có thông tin mô tả, chủ sở hữu, trạng thái duyệt,
  khả năng hiển thị, lượt tải, đánh giá và vị trí lưu trữ tệp.
- **DocumentReview**: Quyết định kiểm duyệt tài liệu, gồm trạng thái phê duyệt hoặc
  từ chối, lý do từ chối khi có, người xử lý và thời điểm xử lý.
- **FavoriteDocument**: Liên kết giữa sinh viên và tài liệu đã lưu.
- **DocumentRating**: Đánh giá của người dùng đối với tài liệu được phép xem.
- **ForumTopic**: Chủ đề thảo luận học thuật, có tác giả, trạng thái mở hoặc khóa và
  nội dung thảo luận.
- **ForumPost**: Bài viết hoặc phản hồi trong diễn đàn.
- **Comment**: Bình luận của người dùng trên bài viết hoặc nội dung nhóm.
- **ViolationReport**: Báo cáo vi phạm do sinh viên hoặc giảng viên gửi, có đối tượng
  bị báo cáo, lý do, trạng thái xử lý và kết quả xử lý.
- **StudyGroup**: Nhóm học tập do giảng viên tạo, có thành viên, quyền tham gia, tài
  liệu nhóm và thảo luận nội bộ.
- **GroupMembership**: Quan hệ giữa người dùng và nhóm học tập, gồm vai trò trong
  nhóm và trạng thái tham gia.
- **GroupDocument**: Tài liệu được chia sẻ trong một nhóm học tập.
- **SystemConfiguration**: Cấu hình vận hành do quản trị viên quản lý.
- **AuditLog**: Bản ghi thao tác quan trọng phục vụ quản lý và kiểm tra hệ thống.

### Access Control *(include for protected functions)*

- **Khách**: Được đăng ký, đăng nhập, tìm kiếm và xem thông tin tài liệu công khai.
  Không được tải tài liệu, thảo luận, tham gia nhóm hoặc cập nhật hồ sơ khi chưa đăng
  nhập.
- **Sinh viên**: Được khai thác tài liệu đã được phép, tham gia diễn đàn, báo cáo vi
  phạm, tham gia nhóm học tập theo quyền nhóm và quản lý hồ sơ cá nhân.
- **Giảng viên**: Được quản lý tài liệu của mình, tạo và quản lý nhóm học tập, tham
  gia diễn đàn, báo cáo vi phạm và quản lý hồ sơ cá nhân.
- **Quản trị nội dung**: Được kiểm duyệt tài liệu, xử lý nội dung diễn đàn vi phạm,
  khóa chủ đề và xử lý báo cáo vi phạm.
- **Quản trị viên**: Được quản lý tài khoản, khóa hoặc mở khóa tài khoản, phân quyền,
  cấu hình hệ thống và xem thống kê tổng thể.
- **Denied Behavior**: Khi người dùng chưa đăng nhập, bị khóa hoặc không có quyền,
  hệ thống MUST từ chối thao tác và không thay đổi dữ liệu liên quan.

### Validation Rules *(include for user and system input)*

- **Đăng ký và cập nhật hồ sơ**: Thông tin bắt buộc không được để trống; định dạng
  liên hệ phải hợp lệ; dữ liệu vượt quá giới hạn cho phép bị từ chối.
- **Đăng nhập và đổi mật khẩu**: Thông tin xác thực bắt buộc phải có; mật khẩu mới
  phải đáp ứng quy tắc độ mạnh tối thiểu của hệ thống.
- **Tài liệu**: Tiêu đề, mô tả, loại tài liệu, khả năng hiển thị và tệp tài liệu phải
  hợp lệ; tài liệu không hợp lệ không được gửi vào hàng chờ duyệt.
- **Từ chối tài liệu**: Lý do từ chối là bắt buộc và phải đủ rõ để giảng viên hiểu
  nguyên nhân.
- **Diễn đàn và nhóm học tập**: Tiêu đề, nội dung bài viết, bình luận và cấu hình
  quyền tham gia nhóm phải hợp lệ trước khi được lưu.
- **Báo cáo vi phạm**: Đối tượng bị báo cáo, loại vi phạm và mô tả lý do phải hợp lệ.
- **Phân quyền và cấu hình hệ thống**: Giá trị đầu vào phải nằm trong tập lựa chọn
  được hệ thống cho phép.
- **Invalid Input Behavior**: Dữ liệu không hợp lệ MUST bị từ chối với thông báo lỗi
  rõ ràng, và hệ thống MUST không tạo hoặc cập nhật bản ghi một phần.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% người dùng có thể hoàn tất đăng ký và đăng nhập hợp lệ trong vòng
  2 phút.
- **SC-002**: 95% lượt tìm kiếm tài liệu công khai hoặc được phép xem trả về kết quả
  trong vòng 2 giây với tập dữ liệu kiểm thử đại diện.
- **SC-003**: 100% tài liệu do giảng viên đăng mới bắt đầu ở trạng thái chờ duyệt và
  không hiển thị công khai trước khi được phê duyệt.
- **SC-004**: 100% lần từ chối tài liệu có lý do từ chối được lưu và hiển thị cho
  người đăng tài liệu.
- **SC-005**: 100% tài khoản bị khóa bị từ chối đăng nhập cho đến khi được mở khóa.
- **SC-006**: 100% thao tác tải tài liệu, tham gia thảo luận, tham gia nhóm và cập
  nhật hồ sơ bị từ chối khi người dùng chưa đăng nhập.
- **SC-007**: 100% báo cáo vi phạm hợp lệ xuất hiện trong danh sách xử lý của quản
  trị nội dung.
- **SC-008**: 100% thao tác quan trọng được yêu cầu bởi quy tắc nghiệp vụ có bản ghi
  kiểm tra tương ứng.
- **SC-009**: Người dùng thuộc từng vai trò chính hoàn thành ít nhất 90% tác vụ cốt
  lõi của vai trò trong kịch bản nghiệm thu.
- **SC-010**: Quản trị viên có thể xem thống kê tổng thể về người dùng, tài liệu, diễn
  đàn, nhóm học tập, báo cáo và kiểm duyệt trong vòng 3 giây với tập dữ liệu kiểm thử
  đại diện.

## Assumptions

- Hệ thống phục vụ một trường học hoặc một tổ chức giáo dục trong phạm vi triển khai
  ban đầu.
- Mỗi tài khoản có ít nhất một vai trò chính; người có nhiều trách nhiệm có thể được
  gán thêm quyền bởi quản trị viên.
- Tài liệu công khai là tài liệu đã được phê duyệt và được đánh dấu cho phép hiển thị
  ngoài phạm vi nhóm học tập.
- Tài liệu nhóm chỉ hiển thị với thành viên hoặc người có quyền theo cấu hình của
  nhóm.
- Nội dung bị xóa vì vi phạm không hiển thị với người dùng thường nhưng vẫn cần đủ
  thông tin phục vụ kiểm tra quản trị.
- Thống kê tổng thể trong phạm vi đầu tiên bao gồm số lượng và trạng thái chính, chưa
  bao gồm phân tích dự báo hoặc gợi ý thông minh.
