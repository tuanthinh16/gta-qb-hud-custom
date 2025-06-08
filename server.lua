local QBCore = exports['qb-core']:GetCoreObject()

-- Gửi dữ liệu status HUD cho client
local function sendHudData(source)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return end

    local metadata = Player.PlayerData.metadata

    TriggerClientEvent('hud:client:updateStatus', source, {
        type = 'updateStatus',
        health = GetEntityHealth(GetPlayerPed(source)) - 100,
        armor = GetPedArmour(GetPlayerPed(source)),
        hunger = metadata.hunger or 100,
        thirst = metadata.thirst or 100,
        stress = metadata.stress or 0,
        oxygen = metadata.oxygen or 100,
        voice = 0, -- mặc định, hoặc thay bằng dữ liệu thực nếu có
        talking = MumbleIsPlayerTalking and MumbleIsPlayerTalking(source) or false,
        show = true
        
    })
    Citizen.Wait(120000); -- Cập nhật mỗi 2 phút
end

-- Gửi dữ liệu vehicle HUD cho client
local function sendVehicleData(source, speed, rpm, fuel)
    TriggerClientEvent('hud:client:updateStatus', source, {
        type = 'updateVehicle',
        speed = speed,
        rpm = rpm,
        fuel = fuel,
        inVehicle = true
    })
end

-- Khi người chơi vào game, gửi HUD
RegisterNetEvent('QBCore:Server:PlayerLoaded', function()
    local src = source
    Wait(3000)
    sendHudData(src)
end)

-- Cập nhật HUD khi player yêu cầu (client gửi)
RegisterNetEvent('hud:server:requestStatus', function()
    sendHudData(source)
end)

-- Lệnh xem cash
QBCore.Commands.Add('cash', 'Check Cash Balance', {}, false, function(source)
    local Player = QBCore.Functions.GetPlayer(source)
    TriggerClientEvent('hud:client:ShowAccounts', source, 'cash', Player.PlayerData.money.cash)
end)

-- Lệnh xem bank
QBCore.Commands.Add('bank', 'Check Bank Balance', {}, false, function(source)
    local Player = QBCore.Functions.GetPlayer(source)
    TriggerClientEvent('hud:client:ShowAccounts', source, 'bank', Player.PlayerData.money.bank)
end)

-- Tăng stress
RegisterNetEvent('hud:server:GainStress', function(amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local stress = (Player.PlayerData.metadata.stress or 0) + amount
    if stress > 100 then stress = 100 end

    Player.Functions.SetMetaData('stress', stress)
    TriggerClientEvent('hud:client:updateStatus', src, {
        type = 'updateStatus',
        stress = stress
    })
end)

-- Giảm stress
RegisterNetEvent('hud:server:RelieveStress', function(amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local stress = (Player.PlayerData.metadata.stress or 0) - amount
    if stress < 0 then stress = 0 end

    Player.Functions.SetMetaData('stress', stress)
    TriggerClientEvent('hud:client:updateStatus', src, {
        type = 'updateStatus',
        stress = stress
    })
end)

-- Callback lấy config nếu cần
QBCore.Functions.CreateCallback('hud:server:getMenu', function(source, cb)
    cb(Config.Menu)
end)
