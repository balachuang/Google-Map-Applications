// angle: 順時針為正
var cameraInfo = [
    // 新店
    {
        'title': '新北市碧潭',
        'position': {'lat': 24.95592248953202, 'lng': 121.53516184925392}, 'angle': -20, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=6wDmAmr7Lqg'
    },{
        'title': '北新路寶橋路口',
        'position': {'lat': 24.97290306043396, 'lng': 121.54293743810781}, 'angle': -90, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=NWT0150'
    },{
        'title': '中興路三段裕隆城旁',
        'position': {'lat': 24.979148868069082, 'lng': 121.54486044729134}, 'angle': 40, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=NWT0129'
    },{
        'title': '寶中路裕隆城旁',
        'position': {'lat': 24.979778117377244, 'lng': 121.54596147140508}, 'angle': 130, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=NWT0486'
    },{
        'title': '新店家樂福門口',
        'position': {'lat': 24.976018820804224, 'lng': 121.54702289484379}, 'angle': 200, 'zoom': 20,
        'url': 'https://www.twipcam.com/cam/nwt-000114'
    },{
        'title': '中央路口小碧潭站旁',
        'position': {'lat': 24.972145920787188, 'lng': 121.52914668248695}, 'angle': 250, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=NWT0151'
    },{
        'title': '水快上橋前',
        'position': {'lat': 24.99127994055705, 'lng': 121.53373484514684}, 'angle': -120, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=NWT0042'
    },

    // 台北
    {
        'title': '擎天崗草原',
        'position': {'lat': 25.16468848295197, 'lng': 121.57558367401835}, 'angle': 180, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=MnODaP-1JaE'
    },{
        'title': '大稻埕碼頭',
        'position': {'lat': 25.05654477482707, 'lng': 121.50786823884091}, 'angle': 120, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=Ndo_8RuefH4'
    },{
        'title': '水源快上層 - 溪州街與汀州路4段140巷口',
        'position': {'lat': 25.005007580146355, 'lng': 121.53479953093249}, 'angle': -125, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=BOT325'
    },{
        'title': '羅斯福路五段211巷口 - 捷運萬隆站',
        'position': {'lat': 25.002217339229926, 'lng': 121.53890340917962}, 'angle': -110, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=BOT361'
    },{
        'title': '信義松德 - 胖子家路口',
        'position': {'lat': 25.033572147428547, 'lng': 121.57426797113034}, 'angle': 5, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=BOT074'
    },{
        'title': '文林北路94巷口 - 中正高中外',
        'position': {'lat': 25.10534328732065, 'lng': 121.51765388464877}, 'angle': -140, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=BOT402'
    },

    // 新竹
    {
        'title': '台積 F12 P4',
        'position': {'lat': 24.77128936888864, 'lng': 121.01290074188852}, 'angle': 25, 'zoom': 20,
        'url': 'http://61.220.211.130:9991/Live?channel=1252&mode=0'
    },

    // 屏東 (not work)
    {
        'title': '廣安路口',
        'position': {'lat': 22.612149946061516, 'lng': 120.48501558918575}, 'angle': 10, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=PIF0010'
    },{
        'title': '復興路上全聯前',
        'position': {'lat': 22.650545519888507, 'lng': 120.48593557324807}, 'angle': 265, 'zoom': 20,
        'url': 'https://www.twipcam.com/cam/t27-58k+600'
    },{
        'title': '復興路/自由路口',
        'position': {'lat': 22.66672492517902, 'lng': 120.48890382527567}, 'angle': 110, 'zoom': 20,
        'url': 'https://www.twipcam.com/cam/t27-56k+450'
    },

    // 台灣
    {
        'title': '小東路成大光復校區旁',
        'position': {'lat': 23.00116373461838, 'lng': 120.21679968241773}, 'angle': 10, 'zoom': 20,
        'url': 'https://tw.live/cam/?id=C112053'
    },{
        'title': '小東路/前鋒路口',
        'position': {'lat': 23.001449267753635, 'lng': 120.2145107263673}, 'angle': 190, 'zoom': 20,
        'url': 'https://www.twipcam.com/cam/tnn-000111'
    },{
        'title': '民族路/前鋒路口',
        'position': {'lat': 22.994405645456833, 'lng': 120.2132321118772}, 'angle': 180, 'zoom': 20,
        'url': 'https://www.twipcam.com/cam/tnn-000104'
    },{
        'title': '高雄蓮池潭',
        'position': {'lat': 22.681153658432603, 'lng': 120.29185075040097}, 'angle': 45, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=BnPoNatG-HE'
    },{
        'title': '西螺服務區 - 1',
        'position': {'lat': 23.788604196922535, 'lng': 120.47739814702622}, 'angle': 45, 'zoom': 20,
        'url': 'https://www.twipcam.com/cam/n1-s-229k+600'
    },{
        'title': '西螺服務區 - 2',
        'position': {'lat': 23.78755380211563, 'lng': 120.47752731781947}, 'angle': 275, 'zoom': 20,
        'url': 'https://www.twipcam.com/cam/n1-n-229k+280'
    },

    // 日本
    {
        'title': '函館山百萬夜景',
        'position': {'lat': 41.759218473253824, 'lng': 140.70409562721238}, 'angle': -45, 'zoom': 14,
        'url': 'https://www.youtube.com/watch?v=s--MDmshT3I'
    },{
        'title': '函館站前循環, 每 20 秒切換一次',
        'position': {'lat': 41.77302834217169, 'lng': 140.72849123925812}, 'angle': 0, 'zoom': 14,
        'url': 'https://www.youtube.com/watch?v=s--MDmshT3I'
    },{
        'title': '東京新宿歌舞伎町',
        'position': {'lat': 35.694186510102455, 'lng': 139.70112808440652}, 'angle': 100, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=DjdUEyjx8GM'
    },{
        'title': '東京淺草寺寶蔵門',
        'position': {'lat': 35.71358129771468, 'lng': 139.79693062210748}, 'angle': -125, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=LHPKP8PP6QY'
    },{
        'title': '北海道札幌狸小路八条',
        'position': {'lat': 43.05639148231004, 'lng': 141.34490412612354}, 'angle': 45, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=CF1vS8DdBIk'
    },{
        'title': '北海道札幌大通公園',
        'position': {'lat': 43.06227856690313, 'lng': 141.35508596068502}, 'angle': 80, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=kfIQBC0hrII'
    },{
        'title': '京都嵯峨嵐山竹林小径',
        'position': {'lat': 35.01728997282734, 'lng': 135.6747127433119}, 'angle': -25, 'zoom': 18,
        'url': 'https://www.youtube.com/watch?v=Op-lf2NRMzs'
    },{
        'title': '京都花見小路',
        'position': {'lat': 35.003832896064246, 'lng': 135.77499137594347}, 'angle': 70, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=PXg3ZXgMkGk'
    },{
        'title': '沖縄那覇市',
        'position': {'lat': 26.215767829587463, 'lng': 127.6786323474458}, 'angle': 45, 'zoom': 18,
        'url': 'https://www.youtube.com/watch?v=6HYjCFkmDPAh'
    },{
        'title': '大阪道頓堀格力高廣告牌',
        'position': {'lat': 34.66918590791304, 'lng': 135.5009456044688}, 'angle': 45, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=ks7Xun3mAB8'
    },{
        'title': '神戶港塔',
        'position': {'lat': 34.68035363278507, 'lng': 135.18813813301003}, 'angle': -100, 'zoom': 17,
        'url': 'https://www.youtube.com/watch?v=AU_2zfM4m68'
    },

    // 美國
    {
        'title': 'Fairbanks Aurora Camera (大致地點)',
        'position': {'lat': 64.87168015770968, 'lng': -147.7432528168914}, 'angle': -90, 'zoom': 12,
        'url': 'https://www.youtube.com/watch?v=O52zDyxg5QI'
    },{
        'title': '拉斯維加斯 歡迎招牌',
        'position': {'lat': 36.0818965166996, 'lng': -115.17291936927923}, 'angle': -45, 'zoom': 12,
        'url': 'https://www.earthcam.com/usa/nevada/lasvegas/?cam=sign_hd'
    },{
        'title': '拉斯維加斯 幻景賭場度假村水舞池',
        'position': {'lat': 36.12030206147902, 'lng': -115.17245839041291}, 'angle': -100, 'zoom': 12,
        'url': 'https://www.nvroads.com/cctv?start=0&length=10&filters%5B0%5D%5Bi%5D=2&filters%5B0%5D%5Bs%5D=Las+Vegas&filters%5B1%5D%5Bi%5D=3&filters%5B1%5D%5Bs%5D=Las+Vegas+Blvd+%26+Harrahs-Mirage+Exit+F1&order%5Bi%5D=1&order%5Bdir%5D=asc'
    },{
        'title': '阿拉斯加 Fairbanks Chena River',
        'position': {'lat': 64.84598506021686, 'lng': -147.70520887119793}, 'angle': 105, 'zoom': 17,
        'url': 'https://webcams.windy.com/webcams/public/embed/player/1219997733/day?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJjYW1faWQiOjEyMTk5OTc3MzMsInVzZXJfdHlwZSI6MSwiYXZhaWxhYmxlX3NpemVzIjoidGVhc2VyYmcsaWNvbix0aHVtYm5haWwscHJldmlldyxub3JtYWwsZnVsbCxwYW5vcmFtYSIsImlhdCI6MTc1Mzc5NTExNSwiZXhwIjoxNzUzODgxNTE1fQ.XY0dP0Hxxgp8s6WNy_1oHFAGHKotLqJSOltQrA9PF_o&autoPlay=1#'
    },

    // 瑞士
    {
        'title': 'Lausanne, pont Bessières',
        'position': {'lat': 46.52170951702846, 'lng': 6.63569485877106}, 'angle': 45, 'zoom': 20,
        'url': 'https://www.youtube.com/watch?v=y3sMI1HtZfE'
    },

    // Ending
    {'title':  '', 'position': {'lat': 0.0, 'lng': 0.0}, 'angle': 0, 'url': 'url' }
];


