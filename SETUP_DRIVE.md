# Cấu hình Google Drive File IDs

## Bước 1 — Lấy File ID từ Google Drive

Với mỗi file trên Google Drive, lấy link chia sẻ:
```
https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuV/view?usp=sharing
                                 ^^^^^^^^^^^^^^^^^^^^^^^^
                                 Đây là FILE_ID cần lấy
```

## Bước 2 — Thêm vào Vercel Environment Variables

Vào Vercel → Project → Settings → Environment Variables → Thêm:

**Key:** `DRIVE_FILES`
**Value:** (JSON, thay FILE_ID thật vào)
```json
{
  "p01": "FILE_ID_nha_pho_2_tang",
  "p02": "FILE_ID_hop_giam_toc",
  "p03": "FILE_ID_biet_thu_3_tang",
  "p04": "FILE_ID_20_mau_cong_sat",
  "p05": "FILE_ID_50_hoa_van_dna",
  "p06": "FILE_ID_do_an_chung_cu",
  "p07": "FILE_ID_mong_coc_khoan_nhoi",
  "p08": "FILE_ID_30_chi_tiet_may",
  "p09": "FILE_ID_nha_xuong_khung_thep",
  "p10": "FILE_ID_30_hoa_van_tran",
  "p11": "FILE_ID_hang_rao_15_mau",
  "p12": "FILE_ID_may_ep_thuy_luc"
}
```

## Bảo mật
- File ID **không bao giờ** lộ ra frontend/source code
- Link tải chỉ được cấp sau khi SePay xác nhận thanh toán thật
- Mỗi lần tải đều re-verify với SePay API
