local Translations = {
    notify = {
        ["hud_settings_loaded"] = "Đã tải cài đặt HUD!",
        ["hud_restart"] = "HUD đang khởi động lại!",
        ["hud_start"] = "HUD đã khởi động!",
        ["hud_command_info"] = "Lệnh này sẽ đặt lại cài đặt HUD của bạn!",
        ["load_square_map"] = "Đang tải bản đồ vuông...",
        ["loaded_square_map"] = "Đã tải bản đồ vuông!",
        ["load_circle_map"] = "Đang tải bản đồ tròn...",
        ["loaded_circle_map"] = "Đã tải bản đồ tròn!",
        ["cinematic_on"] = "Đã bật chế độ điện ảnh!",
        ["cinematic_off"] = "Đã tắt chế độ điện ảnh!",
        ["engine_on"] = "Đã khởi động động cơ!",
        ["engine_off"] = "Đã tắt động cơ!",
        ["low_fuel"] = "Nhiên liệu sắp hết!",
        ["access_denied"] = "Bạn không có quyền truy cập!",
        ["stress_gain"] = "Bạn cảm thấy căng thẳng hơn!",
        ["stress_removed"] = "Bạn cảm thấy thư giãn hơn!"
    }
}

Lang = Locale:new({phrases = Translations, warnOnMissing = true})
