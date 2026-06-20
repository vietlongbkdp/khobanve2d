/**
 * articles-data.js — Nội dung 5 bài blog chuẩn SEO cho MuaBanVe2D
 * Mỗi bài: title, excerpt (mô tả SEO), category, cover (ảnh bìa), content (HTML)
 * Category hợp lệ: huong-dan | thu-thuat | do-an | chia-se
 */

module.exports = [

// ─────────────────────────────────────────────────────────────
{
  title: "Cách Đọc Bản Vẽ Kỹ Thuật Cho Người Mới Bắt Đầu (2026)",
  excerpt: "Hướng dẫn đọc bản vẽ kỹ thuật từ A-Z cho người mới: hình chiếu, mặt cắt, ký hiệu kích thước, dung sai. Nắm vững cách đọc bản vẽ AutoCAD chỉ trong 15 phút.",
  category: "huong-dan",
  cover: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  content: `
<p>Đọc bản vẽ kỹ thuật là kỹ năng nền tảng mà bất kỳ sinh viên, kỹ sư hay người làm trong ngành cơ khí, xây dựng, kiến trúc đều cần nắm vững. Nếu bạn vừa bắt đầu và thấy các bản vẽ AutoCAD chằng chịt ký hiệu khó hiểu, bài viết này sẽ giúp bạn đọc được bản vẽ kỹ thuật một cách bài bản chỉ trong khoảng 15 phút.</p>

<h2>Bản vẽ kỹ thuật là gì?</h2>
<p>Bản vẽ kỹ thuật là ngôn ngữ chung của ngành kỹ thuật, dùng các hình chiếu, đường nét và ký hiệu theo tiêu chuẩn để mô tả chính xác hình dạng, kích thước và yêu cầu chế tạo của một chi tiết hoặc công trình. Tại Việt Nam, bản vẽ tuân theo hệ thống tiêu chuẩn TCVN, gần với tiêu chuẩn ISO quốc tế.</p>

<h2>1. Hiểu về các hình chiếu</h2>
<p>Một vật thể 3 chiều được biểu diễn trên giấy phẳng thông qua các hình chiếu. Ba hình chiếu cơ bản bạn cần nhớ:</p>
<ul>
<li><b>Hình chiếu đứng</b> — nhìn từ phía trước, là hình chiếu chính thể hiện nhiều thông tin nhất.</li>
<li><b>Hình chiếu bằng</b> — nhìn từ trên xuống, đặt ngay dưới hình chiếu đứng.</li>
<li><b>Hình chiếu cạnh</b> — nhìn từ bên trái sang, đặt bên phải hình chiếu đứng.</li>
</ul>
<p>Việt Nam dùng phương pháp chiếu góc thứ nhất (giống châu Âu), khác với Mỹ dùng góc thứ ba. Đây là điểm rất quan trọng cần lưu ý khi đọc bản vẽ từ nguồn nước ngoài.</p>

<h2>2. Phân biệt các loại đường nét</h2>
<p>Mỗi loại đường nét trên bản vẽ mang một ý nghĩa riêng:</p>
<ul>
<li><b>Nét liền đậm</b> — đường bao thấy được của vật thể.</li>
<li><b>Nét đứt</b> — đường khuất, phần không nhìn thấy trực tiếp.</li>
<li><b>Nét chấm gạch mảnh</b> — đường tâm, trục đối xứng.</li>
<li><b>Nét liền mảnh</b> — đường kích thước, đường gióng, đường gạch mặt cắt.</li>
</ul>

<h2>3. Đọc mặt cắt</h2>
<p>Khi chi tiết có cấu trúc bên trong phức tạp, người ta dùng mặt cắt để "cắt" vật thể và thể hiện phần bên trong. Phần vật liệu bị cắt qua được đánh dấu bằng các đường gạch chéo (hatching). Ký hiệu như <b>A-A</b>, <b>B-B</b> cho biết vị trí và hướng cắt tương ứng được đánh dấu trên hình chiếu chính.</p>

<h2>4. Đọc kích thước và dung sai</h2>
<p>Kích thước cho biết độ lớn thực tế của chi tiết. Một số ký hiệu thường gặp:</p>
<ul>
<li><b>⌀</b> — đường kính (ví dụ ⌀42 nghĩa là đường kính 42mm).</li>
<li><b>R</b> — bán kính cung tròn.</li>
<li><b>M</b> — ren hệ mét (ví dụ M12×1.5 là ren đường kính 12mm, bước ren 1.5mm).</li>
<li><b>±</b> — dung sai cho phép (ví dụ 50±0.1 nghĩa là kích thước nằm trong khoảng 49.9 đến 50.1mm).</li>
</ul>

<h2>5. Khung tên bản vẽ</h2>
<p>Khung tên ở góc dưới bên phải chứa thông tin quan trọng: tên chi tiết, vật liệu, tỉ lệ bản vẽ, số bản vẽ, người vẽ và người kiểm tra. Luôn đọc khung tên đầu tiên để nắm bối cảnh trước khi đi vào chi tiết.</p>

<blockquote>Mẹo: Khi đọc bản vẽ lạ, hãy bắt đầu từ khung tên → hình chiếu chính → các hình chiếu phụ → mặt cắt → cuối cùng mới đọc kích thước chi tiết. Trình tự này giúp bạn không bị rối.</blockquote>

<h2>Luyện tập với bản vẽ thực tế</h2>
<p>Lý thuyết chỉ chiếm 30%, 70% còn lại là luyện đọc nhiều bản vẽ thực tế. Bạn có thể tham khảo kho bản vẽ AutoCAD đa dạng tại MuaBanVe2D để luyện tập, từ bản vẽ cơ khí, kiến trúc đến đồ án môn học. Mỗi bản vẽ là một bài tập thực hành quý giá.</p>

<p>Nếu bạn cần một bản vẽ cụ thể mà chưa tìm được, dịch vụ vẽ theo yêu cầu của chúng tôi sẵn sàng hỗ trợ. Chúc bạn sớm thành thạo kỹ năng đọc bản vẽ kỹ thuật!</p>
`
},

// ─────────────────────────────────────────────────────────────
{
  title: "7 Thủ Thuật AutoCAD Giúp Vẽ Nhanh Gấp Đôi",
  excerpt: "Tổng hợp 7 thủ thuật và phím tắt AutoCAD mà dân kỹ thuật chuyên nghiệp thường dùng để tăng tốc độ vẽ. Áp dụng ngay để tiết kiệm hàng giờ làm việc mỗi ngày.",
  category: "thu-thuat",
  cover: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=1200&q=80",
  content: `
<p>Vẽ AutoCAD nhanh hay chậm không nằm ở việc bạn click chuột nhanh thế nào, mà ở chỗ bạn dùng đúng công cụ và phím tắt. Dưới đây là 7 thủ thuật AutoCAD được các kỹ sư chuyên nghiệp sử dụng hàng ngày để tăng tốc độ vẽ lên gấp đôi.</p>

<h2>1. Thuộc lòng phím tắt lệnh cơ bản</h2>
<p>Thay vì tìm nút trên thanh công cụ, gõ phím tắt nhanh hơn rất nhiều. Một số lệnh dùng nhiều nhất:</p>
<ul>
<li><b>L</b> — Line (vẽ đường thẳng)</li>
<li><b>C</b> — Circle (vẽ đường tròn)</li>
<li><b>TR</b> — Trim (cắt đối tượng)</li>
<li><b>EX</b> — Extend (kéo dài đối tượng)</li>
<li><b>O</b> — Offset (vẽ song song)</li>
<li><b>CO</b> — Copy, <b>M</b> — Move, <b>RO</b> — Rotate</li>
</ul>

<h2>2. Dùng Object Snap (OSNAP) đúng cách</h2>
<p>OSNAP giúp con trỏ tự bắt vào các điểm đặc biệt: điểm cuối (Endpoint), trung điểm (Midpoint), tâm (Center), giao điểm (Intersection). Bật OSNAP bằng phím <b>F3</b> và chỉ bật những điểm bắt cần thiết để tránh bị nhiễu.</p>

<h2>3. Tận dụng lệnh Offset thông minh</h2>
<p>Khi vẽ các đường song song cách đều nhau (như tường nhà, đường ray), Offset là cứu tinh. Gõ <b>O</b>, nhập khoảng cách, rồi click liên tục để tạo nhiều đường song song mà không cần đo lại từng lần.</p>

<h2>4. Quản lý Layer khoa học</h2>
<p>Đây là thủ thuật quan trọng nhất nhưng thường bị bỏ qua. Hãy tách các đối tượng vào layer riêng theo chức năng: tường, kích thước, ghi chú, trục... Mỗi layer một màu, một loại nét. Khi cần ẩn/hiện hay sửa hàng loạt, bạn chỉ cần thao tác trên layer thay vì từng đối tượng.</p>

<blockquote>Một bản vẽ có layer sạch sẽ không chỉ vẽ nhanh hơn mà còn chuyên nghiệp hơn — đây cũng là tiêu chí đánh giá file CAD chất lượng khi mua bán.</blockquote>

<h2>5. Tạo Block cho đối tượng lặp lại</h2>
<p>Cửa, cửa sổ, bu lông, ký hiệu... những đối tượng dùng đi dùng lại nên được tạo thành Block (gõ <b>B</b>). Khi cần sửa, bạn chỉ sửa một Block là tất cả các bản sao tự cập nhật. Tiết kiệm hàng giờ chỉnh sửa thủ công.</p>

<h2>6. Dùng lệnh Match Properties</h2>
<p>Gõ <b>MA</b> để sao chép thuộc tính (layer, màu, loại nét) từ đối tượng này sang đối tượng khác. Cực kỳ hữu ích khi bạn muốn đồng bộ nhanh nhiều đối tượng về cùng định dạng.</p>

<h2>7. Lưu template chuẩn của riêng bạn</h2>
<p>Thiết lập sẵn layer, kiểu chữ, kiểu kích thước, khung tên trong một file template (.dwt). Mỗi khi bắt đầu dự án mới, mở template là có ngay môi trường làm việc chuẩn, không phải cài đặt lại từ đầu.</p>

<h2>Kết luận</h2>
<p>Tốc độ vẽ AutoCAD đến từ thói quen dùng phím tắt và tổ chức bản vẽ khoa học. Hãy áp dụng từng thủ thuật một, biến chúng thành phản xạ tự nhiên. Nếu bạn muốn tham khảo các bản vẽ mẫu được tổ chức layer chuyên nghiệp để học hỏi, kho bản vẽ tại MuaBanVe2D có rất nhiều file chất lượng để bạn nghiên cứu.</p>
`
},

// ─────────────────────────────────────────────────────────────
{
  title: "Hướng Dẫn Làm Đồ Án Thiết Kế Hộp Giảm Tốc Từ A đến Z",
  excerpt: "Quy trình đầy đủ làm đồ án chi tiết máy thiết kế hộp giảm tốc 2 cấp: chọn động cơ, tính toán bộ truyền, thiết kế trục, ổ lăn theo tiêu chuẩn. Kèm bản vẽ tham khảo.",
  category: "do-an",
  cover: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=1200&q=80",
  content: `
<p>Đồ án thiết kế hộp giảm tốc là đồ án môn học Chi Tiết Máy kinh điển mà hầu hết sinh viên ngành Cơ khí đều phải làm. Đây là bài viết hướng dẫn quy trình thực hiện đầy đủ, giúp bạn nắm được bức tranh tổng thể trước khi bắt tay vào tính toán.</p>

<h2>Hộp giảm tốc là gì?</h2>
<p>Hộp giảm tốc là bộ phận truyền động cơ khí dùng để giảm tốc độ quay và tăng mô-men xoắn từ động cơ đến máy công tác. Hộp giảm tốc 2 cấp bánh răng trụ là dạng phổ biến nhất trong đồ án vì nó bao quát đầy đủ kiến thức về bánh răng, trục và ổ lăn.</p>

<h2>Bước 1: Chọn động cơ điện</h2>
<p>Từ đề bài (công suất, số vòng quay máy công tác), bạn tính công suất cần thiết trên trục động cơ, có tính đến hiệu suất các bộ truyền. Sau đó tra catalog để chọn động cơ tiêu chuẩn có công suất và số vòng quay phù hợp.</p>

<h2>Bước 2: Phân phối tỉ số truyền</h2>
<p>Tổng tỉ số truyền của hệ được phân phối cho bộ truyền ngoài (đai hoặc xích) và các cấp trong hộp. Việc phân phối hợp lý quyết định kích thước và sự cân đối của hộp giảm tốc. Sau bước này, bạn lập được bảng thông số động học: công suất, số vòng quay, mô-men trên từng trục.</p>

<h2>Bước 3: Thiết kế bộ truyền ngoài</h2>
<p>Thường là bộ truyền đai thang hoặc xích. Bạn tính chọn loại đai/xích, đường kính bánh đai, khoảng cách trục, lực tác dụng lên trục. Kết quả lực này sẽ dùng cho bước thiết kế trục sau đó.</p>

<h2>Bước 4: Thiết kế bộ truyền bánh răng</h2>
<p>Đây là phần trọng tâm và chiếm nhiều điểm nhất:</p>
<ul>
<li>Chọn vật liệu và xác định ứng suất cho phép.</li>
<li>Tính toán thiết kế theo độ bền tiếp xúc và độ bền uốn.</li>
<li>Xác định mô-đun, số răng, đường kính các bánh răng.</li>
<li>Kiểm nghiệm răng về độ bền và quá tải.</li>
</ul>

<h2>Bước 5: Thiết kế trục và then</h2>
<p>Từ lực tác dụng, bạn vẽ biểu đồ mô-men, xác định đường kính trục tại các tiết diện nguy hiểm, sau đó kiểm nghiệm trục về độ bền mỏi và độ bền tĩnh. Tính chọn then để truyền mô-men.</p>

<h2>Bước 6: Chọn ổ lăn</h2>
<p>Dựa vào lực hướng tâm và lực dọc trục, bạn tính chọn ổ bi hoặc ổ đũa, kiểm nghiệm khả năng tải động và tuổi thọ ổ.</p>

<h2>Bước 7: Thiết kế vỏ hộp và bản vẽ</h2>
<p>Cuối cùng là thiết kế kết cấu vỏ hộp, các chi tiết phụ (nắp ổ, vòng phớt, bu lông) và hoàn thiện bản vẽ lắp + bản vẽ chi tiết. Phần bản vẽ thường chiếm trọng số điểm rất lớn.</p>

<blockquote>Lời khuyên: Phần tính toán nên làm cẩn thận từ đầu vì các bước sau phụ thuộc kết quả bước trước. Một sai số ở bước chọn động cơ có thể kéo theo sai toàn bộ đồ án.</blockquote>

<h2>Tham khảo bản vẽ mẫu</h2>
<p>Nếu bạn cần bản vẽ hộp giảm tốc hoàn chỉnh kèm thuyết minh để tham khảo cách trình bày, MuaBanVe2D có sẵn nhiều đồ án chi tiết máy chất lượng. Trường hợp đề bài của bạn đặc thù, dịch vụ vẽ theo yêu cầu của chúng tôi có thể hỗ trợ vẽ đúng số liệu đề bài bạn được giao.</p>
`
},

// ─────────────────────────────────────────────────────────────
{
  title: "File DWG, DXF, DWF Khác Nhau Thế Nào? Hướng Dẫn Chọn Đúng Định Dạng CAD",
  excerpt: "Phân biệt rõ các định dạng file CAD phổ biến: DWG, DXF, DWF, PDF. Hiểu khi nào dùng định dạng nào để chia sẻ, in ấn và chỉnh sửa bản vẽ AutoCAD hiệu quả.",
  category: "huong-dan",
  cover: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=1200&q=80",
  content: `
<p>Khi làm việc với bản vẽ AutoCAD, bạn sẽ gặp nhiều định dạng file khác nhau: DWG, DXF, DWF, PDF. Mỗi định dạng có mục đích riêng. Chọn sai định dạng khi gửi file có thể khiến đối tác không mở được hoặc mất dữ liệu. Bài viết này giúp bạn hiểu rõ và chọn đúng.</p>

<h2>1. File DWG — định dạng gốc của AutoCAD</h2>
<p>DWG (viết tắt của "drawing") là định dạng gốc và phổ biến nhất của AutoCAD. File DWG lưu trữ toàn bộ dữ liệu bản vẽ: đối tượng hình học, layer, block, kích thước, thuộc tính. Đây là định dạng bạn dùng để chỉnh sửa trực tiếp.</p>
<ul>
<li><b>Ưu điểm:</b> giữ nguyên 100% dữ liệu, chỉnh sửa được hoàn toàn.</li>
<li><b>Nhược điểm:</b> cần phần mềm CAD để mở; có vấn đề tương thích giữa các phiên bản AutoCAD khác nhau.</li>
<li><b>Dùng khi:</b> bạn cần chỉnh sửa bản vẽ hoặc giao file cho người cũng dùng CAD.</li>
</ul>

<h2>2. File DXF — định dạng trao đổi</h2>
<p>DXF (Drawing Exchange Format) được tạo ra để trao đổi bản vẽ giữa AutoCAD và các phần mềm CAD khác. Đây là định dạng "trung gian" có khả năng tương thích cao.</p>
<ul>
<li><b>Ưu điểm:</b> mở được trên hầu hết phần mềm CAD, kể cả phần mềm miễn phí.</li>
<li><b>Nhược điểm:</b> dung lượng lớn hơn DWG, đôi khi mất một số thuộc tính phức tạp.</li>
<li><b>Dùng khi:</b> gửi file cho người dùng phần mềm CAD khác AutoCAD, hoặc xuất sang máy cắt CNC, máy laser.</li>
</ul>

<h2>3. File DWF — định dạng xem và chia sẻ</h2>
<p>DWF (Design Web Format) dùng để chia sẻ bản vẽ cho người xem mà không cho phép chỉnh sửa. Giống như "ảnh chụp" bản vẽ nhưng vẫn giữ được thông tin layer và có thể đo đạc.</p>
<ul>
<li><b>Dùng khi:</b> gửi bản vẽ cho khách hàng hoặc sếp xem, duyệt mà không muốn họ sửa.</li>
</ul>

<h2>4. File PDF — định dạng in ấn phổ biến</h2>
<p>PDF là định dạng ai cũng mở được mà không cần phần mềm chuyên dụng. Khi xuất bản vẽ ra PDF, bạn có một bản in đẹp, dễ chia sẻ qua email hay điện thoại.</p>
<ul>
<li><b>Dùng khi:</b> in ấn, gửi nhanh cho người không có phần mềm CAD, lưu trữ bản hoàn thiện.</li>
</ul>

<h2>Bảng so sánh nhanh</h2>
<p>Tóm tắt để bạn dễ chọn: cần <b>chỉnh sửa</b> → dùng DWG. Cần <b>tương thích đa phần mềm / xuất CNC</b> → dùng DXF. Cần <b>cho xem không cho sửa</b> → dùng DWF. Cần <b>in ấn / gửi nhanh</b> → dùng PDF.</p>

<blockquote>Lưu ý khi mua bản vẽ: hãy ưu tiên file DWG gốc để bạn có thể chỉnh sửa theo nhu cầu. Tại MuaBanVe2D, các bản vẽ đều cung cấp file DWG gốc để bạn toàn quyền sử dụng.</blockquote>

<h2>Kết luận</h2>
<p>Hiểu rõ định dạng file CAD giúp bạn làm việc chuyên nghiệp và tránh rắc rối khi chia sẻ bản vẽ. Khi tải bản vẽ từ MuaBanVe2D, bạn luôn nhận được file gốc chất lượng cao, sẵn sàng cho mọi nhu cầu chỉnh sửa và in ấn.</p>
`
},

// ─────────────────────────────────────────────────────────────
{
  title: "Kinh Nghiệm Chọn Mua Bản Vẽ CAD Chất Lượng, Tránh File Lỗi",
  excerpt: "5 tiêu chí đánh giá bản vẽ CAD chất lượng trước khi mua: layer sạch, đúng tỉ lệ, đầy đủ kích thước, file gốc DWG. Tránh mua phải file lỗi, mất tiền oan.",
  category: "chia-se",
  cover: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
  content: `
<p>Mua bản vẽ CAD online giúp bạn tiết kiệm rất nhiều thời gian so với vẽ lại từ đầu. Tuy nhiên, không phải file nào cũng chất lượng. Bài viết chia sẻ 5 tiêu chí giúp bạn đánh giá và chọn mua bản vẽ CAD chất lượng, tránh mua phải file lỗi.</p>

<h2>1. Layer được tổ chức sạch sẽ</h2>
<p>Một bản vẽ chất lượng có hệ thống layer rõ ràng: tường, kích thước, ghi chú, trục... mỗi loại một layer riêng. Bản vẽ "rác" thường gom tất cả vào một layer, khiến bạn rất khó chỉnh sửa. Đây là dấu hiệu đầu tiên của một file chuyên nghiệp.</p>

<h2>2. Đúng tỉ lệ và đơn vị</h2>
<p>Bản vẽ phải được vẽ đúng tỉ lệ 1:1 trong không gian model, dùng đúng đơn vị (mm). File lỗi thường vẽ sai tỉ lệ, khiến khi bạn đo lại hoặc in ra bị sai kích thước thực tế.</p>

<h2>3. Đầy đủ kích thước và ghi chú</h2>
<p>Một bản vẽ kỹ thuật hoàn chỉnh phải có đầy đủ kích thước, ký hiệu vật liệu, dung sai và ghi chú cần thiết. Nếu bản vẽ chỉ có hình mà thiếu kích thước, nó gần như vô dụng cho việc thi công hay gia công.</p>

<h2>4. Cung cấp file gốc DWG</h2>
<p>Hãy luôn ưu tiên nơi bán cung cấp file DWG gốc thay vì chỉ ảnh JPG hay PDF. File gốc cho phép bạn chỉnh sửa, đo đạc và tái sử dụng. Mua phải file ảnh thì bạn không thể làm gì ngoài việc xem.</p>

<blockquote>Tại MuaBanVe2D, mọi bản vẽ đều cung cấp file DWG gốc, được kiểm tra layer và kích thước trước khi đăng bán, đảm bảo bạn nhận được file dùng được ngay.</blockquote>

<h2>5. Có hỗ trợ sau mua</h2>
<p>Nơi bán uy tín luôn có kênh hỗ trợ (như Zalo) để giải đáp khi bạn gặp vấn đề mở file hay cần tư vấn. Tránh mua ở những nơi "tiền trao file xong là hết", vì khi gặp lỗi bạn sẽ không biết hỏi ai.</p>

<h2>Khi không tìm được bản vẽ ưng ý</h2>
<p>Đôi khi bạn cần một bản vẽ rất đặc thù mà không có sẵn trên thị trường. Trong trường hợp đó, đặt vẽ theo yêu cầu là giải pháp tối ưu — bạn nhận được đúng bản vẽ mình cần, đúng số liệu, đúng tiêu chuẩn. MuaBanVe2D cung cấp cả kho bản vẽ có sẵn lẫn dịch vụ vẽ theo yêu cầu để phục vụ trọn vẹn nhu cầu của bạn.</p>

<h2>Kết luận</h2>
<p>Chọn mua bản vẽ CAD thông minh giúp bạn tiết kiệm thời gian và tiền bạc. Hãy luôn kiểm tra 5 tiêu chí trên trước khi quyết định. Chúc bạn tìm được những bản vẽ chất lượng phục vụ tốt cho công việc và học tập!</p>
`
},

];
