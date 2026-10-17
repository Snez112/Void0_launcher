export type SupportedLang = 'vi-vn' | 'en-us' | 'zh-cn';

export interface Translations {
  // Titlebar
  brandBadgeHoyoplay: string;
  brandBadgeGryphline: string;
  serverRegionLabel: string;
  langLabel: string;
  soundMute: string;
  soundUnmute: string;
  minimizeTooltip: string;
  maximizeTooltip: string;
  closeTooltip: string;
  settingsBtn: string;
  minimizeBtn: string;
  maximizeBtn: string;
  closeBtn: string;

  // BottomBar
  versionPill: string;
  noPathSelected: string;
  configPathTip: string;
  preDownloadBtn: string;
  preDownloadTip: string;
  packagesBtn: string;
  packagesPartsBtn: string;
  openFolderBtn: string;
  launchGameBtn: string;
  gameRunningBtn: string;
  updateGameBtn: string;
  launchNeedPathTip: string;

  // Dashboard
  newsAll: string;
  newsAnnounce: string;
  newsActivity: string;
  newsInfo: string;
  noNews: string;

  // Quick Tools & External links
  homeWeb: string;
  interactiveMap: string;
  community: string;
  dailyCheckinTip: string;
  dailyCheckinBtn: string;
  checkinDoneBadge: string;
  checkinPendingBadge: string;
  rollTrackerBtn: string;
  rollTrackerTip: string;
  checkinBtn: string;
  checkinTip: string;
  checkinDone: string;
  checkinPending: string;
  forumBtn: string;
  officialSiteBtn: string;
  skportBtn: string;

  // Settings Modal
  settingsTitle: string;
  gamePathLabel: string;
  exePathLabel: string;
  browseBtn: string;
  browseFileBtn: string;
  browseFolderBtn: string;
  serverRegionGroup: string;
  contentLangGroup: string;
  contentLangLabel: string;
  cancelBtn: string;
  saveBtn: string;

  // Checkin Modal
  checkinModalTitle: string;
  monthlyProgress: string;
  daysUnit: string;
  alreadyCheckedIn: string;
  notCheckedInYet: string;
  checkinSending: string;
  checkinThisGame: string;
  checkinAllGames: string;
  autoCheckinLabel: string;
  hoyolabCookieLabel: string;
  cookiePlaceholder: string;
  cookieGuideTitle: string;
  cookieGuideStep1: string;
  cookieGuideStep2: string;
  cookieGuideStep3: string;
  cookieGuideStep4: string;
  cookieSavedAlert: string;
  saveCookieBtn: string;
  cookieLabel: string;
  cookieSaveSuccess: string;
  checkinSingleBtn: string;
  checkinAllBtn: string;
  checkinTotalDays: string;
  signedToday: string;
  checkinDoneToday: string;
  checkinInProgress: string;

  // Package Modal
  gameSettingsTitle: string;
  tabDisplay: string;
  tabGraphics: string;
  resolutionLabel: string;
  customResolution: string;
  displayModeLabel: string;
  modeFullscreen: string;
  modeWindowed: string;
  borderlessLabel: string;
  borderlessTip: string;
  dx12Label: string;
  dx12Tip: string;
  launchArgsLabel: string;
  launchArgsTip: string;
  fpsLabel: string;
  fps120Tip: string;
  renderScaleLabel: string;
  vsyncLabel: string;
  shadowQualityLabel: string;
  lightQualityLabel: string;
  characterQualityLabel: string;
  envDetailLabel: string;
  reflectionLabel: string;
  sfxQualityLabel: string;
  bloomQualityLabel: string;
  aaModeLabel: string;
  dlssLabel: string;
  saveAndApplyRegistry: string;
  registrySuccessTip: string;
  notSupportedGraphics: string;

  pkgModalTitle: string;
  pkgModalPreTitle: string;
  preDownloadTab: string;
  fullGameTab: string;
  olderPatchesTab: string;
  preDownloadNotice: string;
  directCdnNotice: string;
  patchesNotice: string;
  patchToVersion: string;
  downloadFileBtn: string;
  downloadPatchBtn: string;
  downloadAudioBtn: string;
  gamePart: string;
  audioPart: string;
  noPreDownloadNotice: string;

  // Roll Tracker Modal
  rollTrackerTitle: string;
  rollTrackerModalTitle: string;
  scanningCache: string;
  foundGachaUrl: string;
  syncComplete: string;
  syncFailed: string;
  syncingManual: string;
  tabStats: string;
  tabHistory: string;
  tabSync: string;
  loadingData: string;
  pullsUnit: string;
  currentPityLabel: string;
  averageLabel: string;
  historyFiveStars: string;
  noFiveStars: string;
  noGachaData: string;
  noGachaHint: string;
  goToSyncTab: string;
  allBanners: string;
  thTime: string;
  thItemName: string;
  thType: string;
  thRarity: string;
  thPityPos: string;
  noHistoryRows: string;
  syncMethod1Title: string;
  syncMethod1Step1: string;
  syncMethod1Step2: string;
  syncMethod1Step3: string;
  btnSyncFromCache: string;
  syncMethod2Title: string;
  syncMethod2Desc: string;
  btnSyncManual: string;
  dbSpecTitle: string;
  dbSpecDesc: string;
  tabPityStats: string;
  tabHistoryDetails: string;
  tabImportSync: string;
  pityTotalRolls: string;
  pityGuaranteed: string;
  pityCurrent: string;
  syncCacheBtn: string;
  syncManualBtn: string;
  syncSuccess: string;
  historyTime: string;
  historyName: string;
  historyBanner: string;
  historyPity: string;
  filterAllBanners: string;
  noGachaRecords: string;
  gachaNotSupportedEndfield: string;
}

export const translations: Record<SupportedLang, Translations> = {
  'vi-vn': {
    brandBadgeHoyoplay: 'HoyoPlay',
    brandBadgeGryphline: 'GRYPHLINE',
    serverRegionLabel: 'Máy chủ',
    langLabel: 'Ngôn ngữ',
    soundMute: 'Tắt âm thanh video nền',
    soundUnmute: 'Bật âm thanh video nền',
    minimizeTooltip: 'Thu nhỏ',
    maximizeTooltip: 'Phóng to',
    closeTooltip: 'Đóng',
    settingsBtn: 'Cài đặt game',
    minimizeBtn: 'Thu nhỏ',
    maximizeBtn: 'Phóng to',
    closeBtn: 'Đóng',

    versionPill: 'Phiên bản',
    noPathSelected: 'Chưa chọn đường dẫn game (.exe)',
    configPathTip: 'Nhấn để cấu hình file chạy',
    preDownloadBtn: 'TẢI TRƯỚC',
    preDownloadTip: 'Tải trước bản cập nhật mới ngay từ bây giờ!',
    packagesBtn: 'Các Gói Tải',
    packagesPartsBtn: 'Gói Tải ({count} phần)',
    openFolderBtn: 'Mở Thư Mục',
    launchGameBtn: 'BẮT ĐẦU',
    gameRunningBtn: 'Game đang chạy',
    updateGameBtn: 'CẬP NHẬT',
    launchNeedPathTip: 'Vui lòng nhấn để chọn tệp .exe trước khi khởi chạy game!',

    newsAll: 'Tất cả',
    newsAnnounce: 'Thông báo',
    newsActivity: 'Sự kiện',
    newsInfo: 'Tin tức',
    noNews: 'Không có thông tin mới trong mục này.',

    homeWeb: 'Trang Chủ',
    interactiveMap: 'Bản Đồ Tương Tác',
    community: 'SKPORT',
    dailyCheckinTip: 'Điểm danh nhận quà trực tiếp trên Launcher',
    dailyCheckinBtn: 'Điểm Danh',
    checkinDoneBadge: '✓ Đã nhận',
    checkinPendingBadge: '● Chưa nhận',
    rollTrackerBtn: 'Check Lượt Roll',
    rollTrackerTip: 'Theo dõi lịch sử roll & số nháy Pity từ Database cục bộ',
    checkinBtn: 'Điểm Danh',
    checkinTip: 'Điểm danh nhận quà trực tiếp trên Launcher',
    checkinDone: '✓ Đã nhận',
    checkinPending: '● Chưa nhận',
    forumBtn: 'HoYoLAB',
    officialSiteBtn: 'Trang Chủ',
    skportBtn: 'SKPORT',

    settingsTitle: 'Cài Đặt AIO Launcher',
    gamePathLabel: 'Đường dẫn tệp thực thi của {name} (.exe):',
    exePathLabel: 'Đường dẫn tệp thực thi của {game} (.exe)',
    browseBtn: 'Duyệt Thư Mục',
    browseFileBtn: 'Duyệt File',
    browseFolderBtn: 'Chọn Thư Mục',
    serverRegionGroup: 'Khu vực máy chủ (Server Region):',
    contentLangGroup: 'Ngôn ngữ hiển thị nội dung:',
    contentLangLabel: 'Ngôn ngữ hiển thị nội dung',
    cancelBtn: 'Hủy',
    saveBtn: 'Lưu',

    checkinModalTitle: 'Điểm Danh HoYoLAB Tự Động',
    monthlyProgress: 'Tiến độ tháng này ({game})',
    daysUnit: 'ngày',
    alreadyCheckedIn: 'Hôm nay đã hoàn tất điểm danh',
    notCheckedInYet: 'Hôm nay chưa điểm danh',
    checkinSending: 'Đang gửi...',
    checkinThisGame: 'Điểm Danh Game Này',
    checkinAllGames: 'Điểm Danh Tất Cả Game',
    autoCheckinLabel: 'Tự động điểm danh tất cả game mỗi khi mở Launcher',
    hoyolabCookieLabel: 'HoYoLAB Cookie',
    cookiePlaceholder: 'Dán chuỗi cookie (chứa ltuid_v2, ltoken_v2, ...)',
    cookieGuideTitle: 'Cách lấy Cookie nhanh (chỉ cần làm 1 lần):',
    cookieGuideStep1: 'Đăng nhập tài khoản tại hoyolab.com trên trình duyệt.',
    cookieGuideStep2: 'Nhấn phím F12 (hoặc chuột phải chọn Kiểm tra) → chọn tab Console.',
    cookieGuideStep3: 'Nhập dòng lệnh: copy(document.cookie) rồi nhấn Enter.',
    cookieGuideStep4: 'Quay lại ô trên, dán (Ctrl + V) và nhấn Lưu Cookie.',
    cookieSavedAlert: 'Đã lưu Cookie HoYoLAB thành công!',
    saveCookieBtn: 'Lưu Cookie',
    cookieLabel: 'Cookie HoYoLAB (đăng nhập tại hoyolab.com rồi dán cookie vào đây):',
    cookieSaveSuccess: 'Đã lưu cấu hình Cookie thành công!',
    checkinSingleBtn: 'Điểm Danh Game Này',
    checkinAllBtn: 'Điểm Danh Tất Cả Game',
    checkinTotalDays: 'Đã điểm danh tổng cộng: {count} ngày',
    signedToday: 'Hôm nay: {status}',
    checkinDoneToday: 'Đã nhận thưởng',
    checkinInProgress: 'Đang xử lý...',

    // Game Graphics Settings Modal
    gameSettingsTitle: 'Cài Đặt Game & Đồ Họa ({game})',
    tabDisplay: 'Màn Hình & Khởi Chạy',
    tabGraphics: 'Đồ Họa Trong Game',
    resolutionLabel: 'Độ Phân Giải Màn Hình',
    customResolution: 'Tùy chỉnh (W x H)',
    displayModeLabel: 'Chế Độ Hiển Thị',
    modeFullscreen: 'Toàn Màn Hình (Exclusive Fullscreen)',
    modeWindowed: 'Cửa Sổ (Windowed)',
    borderlessLabel: 'Cửa Sổ Không Viền (Borderless Window)',
    borderlessTip: 'Khởi chạy game ở dạng Borderless không viền (-popupwindow). Dễ dàng Alt+Tab.',
    dx12Label: 'Khởi Chạy Với DirectX 12',
    dx12Tip: 'Thêm tham số -force-d3d12 khi khởi động. Giúp tối ưu khung hình và bật Ray Tracing / Frame Gen nếu GPU hỗ trợ.',
    launchArgsLabel: 'Tham Số Dòng Lệnh Khởi Chạy Tùy Chỉnh',
    launchArgsTip: 'Ví dụ: -popupwindow -screen-width 1920 -screen-height 1080',
    fpsLabel: 'Giới Hạn Tốc Độ Khung Hình (FPS)',
    fps120Tip: '★ 120 FPS là tính năng mở khóa trực tiếp vào registry game (mặc định trong game chỉ tới 60 FPS).',
    renderScaleLabel: 'Tỷ Lệ Hiển Thị (Render Scale)',
    vsyncLabel: 'Đồng Bộ Dọc (V-Sync)',
    shadowQualityLabel: 'Chất Lượng Bóng Đổ (Shadow)',
    lightQualityLabel: 'Chất Lượng Ánh Sáng (Lighting)',
    characterQualityLabel: 'Chi Tiết Nhân Vật (Character)',
    envDetailLabel: 'Chi Tiết Môi Trường (Environment)',
    reflectionLabel: 'Phản Chiếu (Reflection)',
    sfxQualityLabel: 'Hiệu Ứng Kỹ Năng (SFX)',
    bloomQualityLabel: 'Hiệu Ứng Phát Sáng (Bloom)',
    aaModeLabel: 'Khử Răng Cưa (Anti-Aliasing)',
    dlssLabel: 'Chất Lượng NVIDIA DLSS',
    saveAndApplyRegistry: 'Lưu & Áp Dụng Thiết Lập',
    registrySuccessTip: 'Đã lưu thiết lập vào Registry và cấu hình launcher thành công!',
    notSupportedGraphics: 'Cài đặt đồ họa registry hiện được hỗ trợ tốt nhất cho Honkai: Star Rail và game Unity.',

    pkgModalTitle: 'Gói Cài Đặt Game Chính Thức',
    pkgModalPreTitle: 'Tải Trước Bản Cập Nhật & Gói Cài Đặt',
    preDownloadTab: 'Tải Trước (Pre-download v{version})',
    fullGameTab: 'Bản Đầy Đủ Hiện Tại (v{version})',
    olderPatchesTab: 'Bản Vá Cập Nhật ({count})',
    preDownloadNotice: '✦ Nhà phát hành đã mở tính năng Tải Trước! Bạn có thể tải trước toàn bộ tài nguyên bản vá để khi server bảo trì xong là vào chơi ngay.',
    directCdnNotice: 'Đường dẫn tải trực tiếp từ CDN chính chủ của nhà phát hành (Phiên bản {version}):',
    patchesNotice: 'Các gói vá (Patch / HDiff) nâng cấp từ các phiên bản cũ lên phiên bản mới:',
    patchToVersion: 'Vá lên v{version}:',
    downloadFileBtn: 'Tải File',
    downloadPatchBtn: 'Tải Patch',
    downloadAudioBtn: 'Tải Audio',
    gamePart: 'Gói Game phần {index} ({size} GB)',
    audioPart: 'Gói âm thanh ({lang}) - {size} GB',
    noPreDownloadNotice: 'Hiện chưa có tài nguyên tải trước cho tựa game này.',

    rollTrackerTitle: 'Theo Dõi Lịch Sử Roll (Pity Tracker)',
    rollTrackerModalTitle: 'Theo Dõi Lịch Sử Roll (Pity Tracker)',
    scanningCache: 'Đang quét bộ nhớ cache trò chơi...',
    foundGachaUrl: 'Tìm thấy URL gacha! Đang đồng bộ lịch sử roll từ server HoYoverse...',
    syncComplete: 'Đồng bộ hoàn tất! Đã thêm mới {count} bản ghi.',
    syncFailed: 'Thất bại',
    syncingManual: 'Đang đồng bộ từ link thủ công...',
    tabStats: 'Thống Kê Pity',
    tabHistory: 'Lịch Sử Chi Tiết',
    tabSync: 'Đồng Bộ Dữ Liệu',
    loadingData: 'Đang tải dữ liệu...',
    pullsUnit: 'lượt roll',
    currentPityLabel: 'Pity hiện tại',
    averageLabel: 'TB',
    historyFiveStars: 'Lịch sử 5 sao nhận được',
    noFiveStars: 'Chưa có 5 sao nào trong banner này',
    noGachaData: 'Chưa có dữ liệu roll cho tựa game này',
    noGachaHint: 'Vào game mở trang Lịch Sử Roll, sau đó nhấn nút Đồng Bộ Dữ Liệu bên dưới để launcher tự động lấy dữ liệu.',
    goToSyncTab: 'Đến tab Đồng Bộ Dữ Liệu',
    allBanners: 'Tất cả Banner',
    thTime: 'Thời gian',
    thItemName: 'Tên vật phẩm',
    thType: 'Loại',
    thRarity: 'Độ hiếm',
    thPityPos: 'Vị trí Pity',
    noHistoryRows: 'Chưa có lịch sử roll nào.',
    syncMethod1Title: 'Cách 1: Tự Động Quét Cache Game (Khuyên Dùng)',
    syncMethod1Step1: 'Mở game ({game}) lên.',
    syncMethod1Step2: 'Vào mục Gacha/Cầu Nguyện → bấm xem Lịch Sử (hoặc Chi Tiết).',
    syncMethod1Step3: 'Sau đó bấm nút dưới đây, Launcher sẽ tự trích xuất URL và tải toàn bộ lượt roll vào database Starward:',
    btnSyncFromCache: 'Tự Động Đọc Cache & Đồng Bộ',
    syncMethod2Title: 'Cách 2: Dán Link Gacha Thủ Công',
    syncMethod2Desc: 'Nếu cách tự động không tìm được file cache, bạn có thể dán trực tiếp đường link lấy từ Powershell hoặc game vào đây:',
    btnSyncManual: 'Đồng Bộ Link',
    dbSpecTitle: 'Đặc tả lưu trữ dữ liệu Database:',
    dbSpecDesc: 'Toàn bộ dữ liệu được lưu cục bộ trong file SQLite chuẩn Starward:',
    tabPityStats: 'Thống Kê Pity',
    tabHistoryDetails: 'Lịch Sử Chi Tiết',
    tabImportSync: 'Đồng Bộ Dữ Liệu',
    pityTotalRolls: 'Tổng Lượt Roll',
    pityGuaranteed: 'Bảo Hiểm',
    pityCurrent: 'Đang Tích',
    syncCacheBtn: 'Tự Động Đọc Cache Game',
    syncManualBtn: 'Nhập Link Thủ Công',
    syncSuccess: 'Đồng bộ hoàn tất! Đã thêm mới {count} bản ghi.',
    historyTime: 'Thời Gian',
    historyName: 'Tên Vật Phẩm',
    historyBanner: 'Banner',
    historyPity: 'Số Nháy',
    filterAllBanners: 'Tất Cả Banner',
    noGachaRecords: 'Chưa có bản ghi roll nào trong database cục bộ.',
    gachaNotSupportedEndfield: 'Arknights: Endfield sử dụng hệ thống gacha riêng của Hypergryph/Gryphline. Tính năng đồng bộ hiện dành cho các game định dạng HoYoverse/Starward.',
  },

  'en-us': {
    brandBadgeHoyoplay: 'HoyoPlay',
    brandBadgeGryphline: 'GRYPHLINE',
    serverRegionLabel: 'Server',
    langLabel: 'Language',
    soundMute: 'Mute background video audio',
    soundUnmute: 'Unmute background video audio',
    minimizeTooltip: 'Minimize',
    maximizeTooltip: 'Maximize',
    closeTooltip: 'Close',
    settingsBtn: 'Game Settings',
    minimizeBtn: 'Minimize',
    maximizeBtn: 'Maximize',
    closeBtn: 'Close',

    versionPill: 'Version',
    noPathSelected: 'Game path not configured (.exe)',
    configPathTip: 'Click to configure executable path',
    preDownloadBtn: 'PRE-DOWNLOAD',
    preDownloadTip: 'Pre-download the upcoming patch resources now!',
    packagesBtn: 'Download Packages',
    packagesPartsBtn: 'Packages ({count} parts)',
    openFolderBtn: 'Open Folder',
    launchGameBtn: 'START GAME',
    gameRunningBtn: 'Game is running',
    updateGameBtn: 'UPDATE',
    launchNeedPathTip: 'Please click to select your game .exe first!',

    newsAll: 'All',
    newsAnnounce: 'Notices',
    newsActivity: 'Events',
    newsInfo: 'News',
    noNews: 'No announcements available in this category.',

    homeWeb: 'Official Site',
    interactiveMap: 'Interactive Map',
    community: 'SKPORT',
    dailyCheckinTip: 'Claim daily rewards directly in Launcher',
    dailyCheckinBtn: 'Daily Check-in',
    checkinDoneBadge: '✓ Claimed',
    checkinPendingBadge: '● Pending',
    rollTrackerBtn: 'Wish Tracker',
    rollTrackerTip: 'Track pull history and pity counts from local database',
    checkinBtn: 'Check-in',
    checkinTip: 'Claim daily rewards directly in Launcher',
    checkinDone: '✓ Claimed',
    checkinPending: '● Pending',
    forumBtn: 'HoYoLAB',
    officialSiteBtn: 'Official Site',
    skportBtn: 'SKPORT',

    settingsTitle: 'AIO Launcher Settings',
    gamePathLabel: 'Executable path for {name} (.exe):',
    exePathLabel: 'Executable path for {game} (.exe)',
    browseBtn: 'Browse Folder',
    browseFileBtn: 'Browse File',
    browseFolderBtn: 'Select Folder',
    serverRegionGroup: 'Server Region:',
    contentLangGroup: 'Content Language:',
    contentLangLabel: 'Content Display Language',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',

    checkinModalTitle: 'HoYoLAB Daily Check-in',
    monthlyProgress: 'Monthly Progress ({game})',
    daysUnit: 'days',
    alreadyCheckedIn: 'Already checked in today',
    notCheckedInYet: 'Not checked in yet today',
    checkinSending: 'Sending...',
    checkinThisGame: 'Check-in Current Game',
    checkinAllGames: 'Check-in All Games',
    autoCheckinLabel: 'Auto check-in all games when launcher opens',
    hoyolabCookieLabel: 'HoYoLAB Cookie',
    cookiePlaceholder: 'Paste cookie string (containing ltuid_v2, ltoken_v2, ...)',
    cookieGuideTitle: 'How to get Cookie quickly (one-time setup):',
    cookieGuideStep1: 'Log in to your account at hoyolab.com in your web browser.',
    cookieGuideStep2: 'Press F12 (or right-click → Inspect) → select the Console tab.',
    cookieGuideStep3: 'Enter command: copy(document.cookie) then hit Enter.',
    cookieGuideStep4: 'Return here, paste (Ctrl + V) and click Save Cookie.',
    cookieSavedAlert: 'HoYoLAB Cookie saved successfully!',
    saveCookieBtn: 'Save Cookie',
    cookieLabel: 'HoYoLAB Cookie (log in at hoyolab.com and paste cookie here):',
    cookieSaveSuccess: 'Cookie configuration saved successfully!',
    checkinSingleBtn: 'Check-in Current Game',
    checkinAllBtn: 'Check-in All Games',
    checkinTotalDays: 'Total checked-in: {count} days',
    signedToday: 'Today: {status}',
    checkinDoneToday: 'Reward claimed',
    checkinInProgress: 'Processing...',

    // Game Graphics Settings Modal
    gameSettingsTitle: 'Game & Graphics Settings ({game})',
    tabDisplay: 'Display & Launch',
    tabGraphics: 'In-Game Graphics',
    resolutionLabel: 'Display Resolution',
    customResolution: 'Custom (W x H)',
    displayModeLabel: 'Display Mode',
    modeFullscreen: 'Exclusive Fullscreen',
    modeWindowed: 'Windowed',
    borderlessLabel: 'Borderless Window',
    borderlessTip: 'Launch in borderless window mode (-popupwindow) for seamless Alt+Tab.',
    dx12Label: 'Launch with DirectX 12',
    dx12Tip: 'Adds -force-d3d12 to launch options. Unlocks Ray Tracing and Frame Gen if supported.',
    launchArgsLabel: 'Custom Launch Arguments',
    launchArgsTip: 'e.g., -popupwindow -screen-width 1920 -screen-height 1080',
    fpsLabel: 'Frame Rate Limit (FPS)',
    fps120Tip: '★ 120 FPS directly writes to the game registry (in-game cap is 60 FPS).',
    renderScaleLabel: 'Render Scale',
    vsyncLabel: 'V-Sync',
    shadowQualityLabel: 'Shadow Quality',
    lightQualityLabel: 'Lighting Quality',
    characterQualityLabel: 'Character Quality',
    envDetailLabel: 'Environment Detail',
    reflectionLabel: 'Reflection Quality',
    sfxQualityLabel: 'SFX Quality',
    bloomQualityLabel: 'Bloom Quality',
    aaModeLabel: 'Anti-Aliasing Mode',
    dlssLabel: 'NVIDIA DLSS Quality',
    saveAndApplyRegistry: 'Save & Apply to Registry',
    registrySuccessTip: 'Successfully applied settings to Windows Registry and launcher config!',
    notSupportedGraphics: 'Deep registry graphics tweak is currently optimized for Honkai: Star Rail and Unity titles.',

    pkgModalTitle: 'Official Game Packages',
    pkgModalPreTitle: 'Pre-download & Game Packages',
    preDownloadTab: 'Pre-download (v{version})',
    fullGameTab: 'Full Client (v{version})',
    olderPatchesTab: 'Update Patches ({count})',
    preDownloadNotice: '✦ Official Pre-download is now open! Download patch assets in advance to play immediately after maintenance.',
    directCdnNotice: 'Direct download links from official CDN servers (Version {version}):',
    patchesNotice: 'Incremental update packages (Patch / HDiff) from earlier versions:',
    patchToVersion: 'Patch to v{version}:',
    downloadFileBtn: 'Download',
    downloadPatchBtn: 'Download Patch',
    downloadAudioBtn: 'Download Audio',
    gamePart: 'Game package part {index} ({size} GB)',
    audioPart: 'Audio package ({lang}) - {size} GB',
    noPreDownloadNotice: 'No pre-download resources available for this game yet.',

    rollTrackerTitle: 'Wish & Pity Tracker',
    rollTrackerModalTitle: 'Wish & Pity Tracker',
    scanningCache: 'Scanning game cache files...',
    foundGachaUrl: 'Found gacha URL! Syncing pull records from HoYoverse servers...',
    syncComplete: 'Sync completed! Added {count} new records.',
    syncFailed: 'Failed',
    syncingManual: 'Syncing from manual link...',
    tabStats: 'Pity Statistics',
    tabHistory: 'Detailed History',
    tabSync: 'Sync Data',
    loadingData: 'Loading data...',
    pullsUnit: 'pulls',
    currentPityLabel: 'Current Pity',
    averageLabel: 'Avg',
    historyFiveStars: '5-Star Pull History',
    noFiveStars: 'No 5-stars pulled yet in this banner',
    noGachaData: 'No pull data found for this game',
    noGachaHint: 'Launch the game, open the Wish/Gacha History page, then click Sync Data below.',
    goToSyncTab: 'Go to Sync Data Tab',
    allBanners: 'All Banners',
    thTime: 'Time',
    thItemName: 'Item Name',
    thType: 'Type',
    thRarity: 'Rarity',
    thPityPos: 'Pity Pos',
    noHistoryRows: 'No pull history records.',
    syncMethod1Title: 'Method 1: Auto Scan Game Cache (Recommended)',
    syncMethod1Step1: 'Launch the game ({game}).',
    syncMethod1Step2: 'Go to Wish/Gacha → open the History page.',
    syncMethod1Step3: 'Click the button below to extract URL and save pulls into Starward database:',
    btnSyncFromCache: 'Auto Scan Cache & Sync',
    syncMethod2Title: 'Method 2: Paste Gacha Link Manually',
    syncMethod2Desc: 'If auto cache detection fails, paste your extracted authkey gacha link here:',
    btnSyncManual: 'Sync Link',
    dbSpecTitle: 'Database Storage Specification:',
    dbSpecDesc: 'All gacha data is saved locally in Starward-standard SQLite format:',
    tabPityStats: 'Pity Statistics',
    tabHistoryDetails: 'Detailed History',
    tabImportSync: 'Sync Data',
    pityTotalRolls: 'Total Rolls',
    pityGuaranteed: 'Guaranteed',
    pityCurrent: 'Current Pity',
    syncCacheBtn: 'Auto-detect Game Cache',
    syncManualBtn: 'Enter Manual Link',
    syncSuccess: 'Sync completed! Added {count} new records.',
    historyTime: 'Timestamp',
    historyName: 'Item Name',
    historyBanner: 'Banner',
    historyPity: 'Pity',
    filterAllBanners: 'All Banners',
    noGachaRecords: 'No gacha records found in the local database.',
    gachaNotSupportedEndfield: 'Arknights: Endfield uses Hypergryph/Gryphline gacha infrastructure. Pity tracking currently mirrors HoYoverse/Starward schemas.',
  },

  'zh-cn': {
    brandBadgeHoyoplay: 'HoyoPlay',
    brandBadgeGryphline: 'GRYPHLINE',
    serverRegionLabel: '服务器',
    langLabel: '语言',
    soundMute: '关闭背景视频声音',
    soundUnmute: '开启背景视频声音',
    minimizeTooltip: '最小化',
    maximizeTooltip: '最大化',
    closeTooltip: '关闭',
    settingsBtn: '游戏设置',
    minimizeBtn: '最小化',
    maximizeBtn: '最大化',
    closeBtn: '关闭',

    versionPill: '版本',
    noPathSelected: '未配置游戏启动路径 (.exe)',
    configPathTip: '点击配置游戏启动路径',
    preDownloadBtn: '预下载',
    preDownloadTip: '立即预下载最新版本更新资源！',
    packagesBtn: '安装包列表',
    packagesPartsBtn: '安装包（共 {count} 个分包）',
    openFolderBtn: '打开目录',
    launchGameBtn: '开始游戏',
    gameRunningBtn: '游戏运行中',
    updateGameBtn: '更新游戏',
    launchNeedPathTip: '请先点击选择游戏的 .exe 可执行文件！',

    newsAll: '全部',
    newsAnnounce: '公告',
    newsActivity: '活动',
    newsInfo: '资讯',
    noNews: '暂无资讯内容。',

    homeWeb: '游戏官网',
    interactiveMap: '互动地图',
    community: '森空岛',
    dailyCheckinTip: '在启动器内直接完成每日签到领奖',
    dailyCheckinBtn: '每日签到',
    checkinDoneBadge: '✓ 已签到',
    checkinPendingBadge: '● 待签到',
    rollTrackerBtn: '抽卡记录',
    rollTrackerTip: '从本地 SQLite 数据库查看保底与抽卡历史',
    checkinBtn: '每日签到',
    checkinTip: '在启动器内直接完成每日签到领奖',
    checkinDone: '✓ 已签到',
    checkinPending: '● 待签到',
    forumBtn: '米游社 / HoYoLAB',
    officialSiteBtn: '游戏官网',
    skportBtn: '森空岛 / SKPORT',

    settingsTitle: 'AIO 启动器设置',
    gamePathLabel: '{name} 的可执行文件路径 (.exe):',
    exePathLabel: '{game} 的可执行文件路径 (.exe)',
    browseBtn: '浏览目录',
    browseFileBtn: '浏览文件',
    browseFolderBtn: '选择目录',
    serverRegionGroup: '服务器区域:',
    contentLangGroup: '内容显示语言:',
    contentLangLabel: '内容显示语言',
    cancelBtn: '取消',
    saveBtn: '保存',

    checkinModalTitle: 'HoYoLAB 自动签到',
    monthlyProgress: '本月进度（{game}）',
    daysUnit: '天',
    alreadyCheckedIn: '今日已完成签到',
    notCheckedInYet: '今日尚未签到',
    checkinSending: '正在提交...',
    checkinThisGame: '签到当前游戏',
    checkinAllGames: '一键签到全部游戏',
    autoCheckinLabel: '启动器启动时自动签到全部游戏',
    hoyolabCookieLabel: 'HoYoLAB Cookie',
    cookiePlaceholder: '粘贴包含 ltuid_v2, ltoken_v2 的 Cookie 字符串...',
    cookieGuideTitle: '如何快速获取 Cookie（仅需一次）：',
    cookieGuideStep1: '在浏览器中登录 hoyolab.com 账号。',
    cookieGuideStep2: '按 F12（或右键审查元素）→ 切换到 控制台 (Console) 标签。',
    cookieGuideStep3: '输入命令：copy(document.cookie) 并回车。',
    cookieGuideStep4: '返回本窗口，粘贴 (Ctrl + V) 并点击 保存 Cookie。',
    cookieSavedAlert: 'HoYoLAB Cookie 保存成功！',
    saveCookieBtn: '保存 Cookie',
    cookieLabel: 'HoYoLAB Cookie（登录后复制粘贴至此）:',
    cookieSaveSuccess: 'Cookie 配置保存成功！',
    checkinSingleBtn: '签到当前游戏',
    checkinAllBtn: '一键签到全部游戏',
    checkinTotalDays: '累计已签到: {count} 天',
    signedToday: '今日状态: {status}',
    checkinDoneToday: '已领取奖励',
    checkinInProgress: '处理中...',

    // Game Graphics Settings Modal
    gameSettingsTitle: '游戏与图形设置 ({game})',
    tabDisplay: '显示与启动',
    tabGraphics: '游戏内画质',
    resolutionLabel: '显示分辨率',
    customResolution: '自定义 (宽 x 高)',
    displayModeLabel: '显示模式',
    modeFullscreen: '独占全屏 (Fullscreen)',
    modeWindowed: '窗口化 (Windowed)',
    borderlessLabel: '无边框窗口 (Borderless)',
    borderlessTip: '使用 -popupwindow 启动无边框窗口，方便快速切屏切出。',
    dx12Label: '启用 DirectX 12 运行',
    dx12Tip: '使用 -force-d3d12 启动参数，支持开启光线追踪及帧生成（需显卡支持）。',
    launchArgsLabel: '自定义启动命令行参数',
    launchArgsTip: '例如: -popupwindow -screen-width 1920 -screen-height 1080',
    fpsLabel: '帧率上限 (FPS)',
    fps120Tip: '★ 120 FPS 将直接写入游戏注册表（游戏内原生上限仅为 60 帧）。',
    renderScaleLabel: '渲染精度 (Render Scale)',
    vsyncLabel: '垂直同步 (V-Sync)',
    shadowQualityLabel: '阴影质量 (Shadow)',
    lightQualityLabel: '光照质量 (Lighting)',
    characterQualityLabel: '角色细节 (Character)',
    envDetailLabel: '场景细节 (Environment)',
    reflectionLabel: '反射质量 (Reflection)',
    sfxQualityLabel: '特效质量 (SFX)',
    bloomQualityLabel: '光晕效果 (Bloom)',
    aaModeLabel: '抗锯齿模式 (Anti-Aliasing)',
    dlssLabel: 'NVIDIA DLSS 质量',
    saveAndApplyRegistry: '保存并写入注册表',
    registrySuccessTip: '已成功将画质与分辨率写入系统注册表与启动配置！',
    notSupportedGraphics: '高级注册表画质精修目前主要适配《崩坏：星穹铁道》及 Unity 内核游戏。',

    pkgModalTitle: '官方游戏安装包',
    pkgModalPreTitle: '预下载与游戏安装包',
    preDownloadTab: '预下载 (v{version})',
    fullGameTab: '完整客户端 (v{version})',
    olderPatchesTab: '增量更新补丁 ({count})',
    preDownloadNotice: '✦ 官方已开启预下载！您可以提前下载更新资源，待维护结束后即可直接进入游戏。',
    directCdnNotice: '官方 CDN 直链下载地址（版本 {version}）：',
    patchesNotice: '旧版本增量补丁（Patch / HDiff）更新包：',
    patchToVersion: '升级至 v{version}：',
    downloadFileBtn: '下载文件',
    downloadPatchBtn: '下载补丁',
    downloadAudioBtn: '下载语音包',
    gamePart: '游戏分包 {index}（{size} GB）',
    audioPart: '语音包 ({lang}) - {size} GB',
    noPreDownloadNotice: '该游戏当前未开放预下载资源。',

    rollTrackerTitle: '抽卡记录与保底分析',
    rollTrackerModalTitle: '抽卡记录与保底分析',
    scanningCache: '正在扫描游戏缓存文件...',
    foundGachaUrl: '找到抽卡链接！正在从米哈游服务器拉取抽卡历史...',
    syncComplete: '同步完成！新增 {count} 条抽卡记录。',
    syncFailed: '失败',
    syncingManual: '正在从手动链接同步...',
    tabStats: '保底统计',
    tabHistory: '详细历史',
    tabSync: '数据同步',
    loadingData: '正在加载数据...',
    pullsUnit: '抽',
    currentPityLabel: '已垫抽数',
    averageLabel: '平均',
    historyFiveStars: '出金记录',
    noFiveStars: '该卡池尚未出金',
    noGachaData: '暂无该游戏的抽卡记录',
    noGachaHint: '在游戏中打开抽卡历史记录页面，然后点击下方的数据同步按钮即可自动获取。',
    goToSyncTab: '前往数据同步',
    allBanners: '全部卡池',
    thTime: '时间',
    thItemName: '物品名称',
    thType: '类型',
    thRarity: '星级',
    thPityPos: '抽数位置',
    noHistoryRows: '暂无抽卡记录。',
    syncMethod1Title: '方式 1：自动读取游戏缓存（推荐）',
    syncMethod1Step1: '启动游戏（{game}）。',
    syncMethod1Step2: '进入祈愿/调频 → 打开 历史记录 页面。',
    syncMethod1Step3: '点击下方按钮，启动器将自动读取链接并存入本地 Starward 数据库：',
    btnSyncFromCache: '自动读取缓存并同步',
    syncMethod2Title: '方式 2：手动粘贴抽卡链接',
    syncMethod2Desc: '若自动检测失败，可将通过 PowerShell 或游戏提取的 authkey 链接粘贴于此：',
    btnSyncManual: '同步链接',
    dbSpecTitle: '本地数据库存储规范：',
    dbSpecDesc: '所有抽卡数据安全存储于本地 Starward 标准 SQLite 数据库中：',
    tabPityStats: '保底统计',
    tabHistoryDetails: '详细历史',
    tabImportSync: '数据同步',
    pityTotalRolls: '累计抽数',
    pityGuaranteed: '大保底',
    pityCurrent: '已垫抽数',
    syncCacheBtn: '自动读取游戏缓存',
    syncManualBtn: '手动输入抽卡链接',
    syncSuccess: '同步完成！新增 {count} 条抽卡记录。',
    historyTime: '时间',
    historyName: '物品名称',
    historyBanner: '卡池',
    historyPity: '抽数',
    filterAllBanners: '全部卡池',
    noGachaRecords: '本地数据库中暂无抽卡记录。',
    gachaNotSupportedEndfield: '《明日方舟：终末地》使用鹰角网络专属抽卡系统，当前抽卡分析主要适配米哈游/Starward数据格式。',
  },
};

export function getT(lang: string): Translations {
  const normalized = lang.toLowerCase() as SupportedLang;
  if (normalized in translations) {
    return translations[normalized];
  }
  if (normalized.startsWith('zh')) return translations['zh-cn'];
  if (normalized.startsWith('vi')) return translations['vi-vn'];
  return translations['en-us'];
}
