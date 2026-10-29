window.VuoriData={
 pages:[['U01','首页','首页与导购'],['U02','分类','首页与导购'],['U03','商品列表','首页与导购'],['U04','搜索商品','首页与导购'],['U05','品牌上新','首页与导购'],['U06','搭配详情','首页与导购'],['U07','内容详情','首页与导购'],['U08','商品详情','商品详情'],['U09','购物袋','购物袋与结算'],['U10','确认订单','购物袋与结算'],['U11','收货地址','购物袋与结算'],['U12','编辑地址','购物袋与结算'],['U13','支付结果','购物袋与结算'],['U14','我的订单','订单与售后'],['U15','订单详情','订单与售后'],['U16','物流详情','订单与售后'],['U17','售后记录','订单与售后'],['U18','选择售后商品','订单与售后'],['U19','申请售后','订单与售后'],['U20','售后进度','订单与售后'],['U21','退货物流','订单与售后'],['U22','社区活动','社区活动'],['U23','发现活动','社区活动'],['U24','活动详情','社区活动'],['U25','确认报名','社区活动'],['U26','报名结果','社区活动'],['U27','我的活动','社区活动'],['U28','预约详情','社区活动'],['U29','候补详情','社区活动'],['U30','我的','我的与会员'],['U31','登录 / 入会','我的与会员'],['U32','手机号登录','我的与会员'],['U33','个人资料','我的与会员'],['U34','会员码','我的与会员'],['U35','我的优惠券','我的与会员'],['U36','优惠券详情','我的与会员'],['U37','查找门店','我的与会员'],['U38','门店与顾问','我的与会员']],
 products:[
 {id:'halo',name:'Halo Essential Wideleg',cn:'女士柔软阔腿长裤',price:980,gender:'女士',category:'长裤',fabric:'DreamKnit',scene:'日常',image:'halo-studio.png.webp',colors:[['樱桃深红','#4a1627'],['炭灰黑','#333333'],['云雾白','#ededed']],sizes:['XS','S','M','L','XL'],stock:8},
 {id:'strato',name:'Strato Tech Tee',cn:'男士轻盈运动短袖',price:580,gender:'男士',category:'上装',fabric:'Strato',scene:'训练',image:'strato-tee.png.webp',colors:[['海岸蓝','#314b6d'],['炭灰黑','#333333'],['云雾白','#ededed']],sizes:['S','M','L','XL'],stock:9},
 {id:'bliss',name:'AllTheFeels Bra',cn:'女士柔软运动内衣',price:680,gender:'女士',category:'运动内衣',fabric:'BlissBlend',scene:'训练',image:'feel.webp.webp',colors:[['浆果红','#8f403d'],['炭灰黑','#333333']],sizes:['XS','S','M','L'],stock:6},
 {id:'polo',name:'Everyday Polo',cn:'男士日常短袖 Polo',price:780,gender:'男士',category:'上装',fabric:'Performance',scene:'日常',image:'men.jpg.webp',colors:[['浅粉色','#cbb7b4'],['云雾白','#ededed']],sizes:['S','M','L','XL'],stock:5},
 {id:'daily',name:'Everyday Wideleg',cn:'女士休闲阔腿长裤',price:890,gender:'女士',category:'长裤',fabric:'DreamKnit',scene:'日常',image:'women.jpg.webp',colors:[['云雾白','#ededed']],sizes:['S','M','L'],stock:0},
 {id:'retired',name:'Seasonal Essential',cn:'往季系列单品',price:null,gender:'男士',category:'上装',fabric:'Performance',scene:'户外',image:'men.jpg.webp',colors:[['浅粉色','#cbb7b4']],sizes:['M','L'],stock:0,retired:true}
 ],
 activities:[
 {id:'hike',type:'Hike',cn:'徒步',name:'走进山野，找回自己的节奏',image:'community.png.webp',date:'2026-10-24',time:'08:30–11:30',city:'深圳',place:'梧桐山 · 山径入口',status:'未开始',mode:'open',coach:'Alex',desc:'与社区伙伴沿山径前行，放慢脚步，在自然中感受每一次呼吸。'},
 {id:'surf',type:'Surf',cn:'冲浪',name:'向着海浪，自由出发',image:'surf.png.webp',date:'2026-10-31',time:'09:00–11:00',city:'深圳',place:'大鹏海岸 · 社区集合点',status:'未开始',mode:'full',coach:'Aria',desc:'走近海洋，在专业教练的引导下学习基础动作，与伙伴一起体验海岸生活。'},
 {id:'train',type:'Train',cn:'训练',name:'一起动起来，唤醒好状态',image:'training.png.webp',date:'2026-11-01',time:'10:00–11:00',city:'上海',place:'社区运动空间',status:'未开始',mode:'upcoming',coach:'Sam',desc:'从热身到舒展，在自然的运动节奏中找到自己的状态。'},
 {id:'run',type:'Run',cn:'跑步',name:'城市晨跑，发现另一种风景',image:'hero.png.webp',date:'2026-10-25',time:'07:30–09:00',city:'深圳',place:'深圳湾公园 · 集合点',status:'未开始',mode:'open',coach:'Alex',desc:'以舒适的配速，一起开启清晨的运动时光。'},
 {id:'chill',type:'Chill',cn:'舒展',name:'舒展身心，慢下来感受',image:'yoga.png.webp',date:'2026-11-08',time:'09:00–10:00',city:'上海',place:'社区运动空间',status:'未开始',mode:'open',coach:'Aria',desc:'让呼吸引导身体，在舒展与流动中回归当下。'}
 ],
 coupons:[{id:'online',name:'线上选购体验券',amount:100,threshold:800,online:true,expires:'2026.12.31',status:'可用'},{id:'store',name:'门店专属体验券',amount:80,threshold:0,online:false,expires:'2026.12.31',status:'可用'},{id:'expired',name:'过往体验券',amount:50,threshold:500,online:true,expires:'2026.09.30',status:'已过期'}],
 stores:[{id:'sz',name:'深圳罗湖万象城店',city:'深圳',address:'深圳市罗湖区 · 万象城',hours:'10:00–22:00',phone:'门店电话以正式信息为准'},{id:'sh',name:'上海品牌体验空间',city:'上海',address:'上海市 · 品牌体验空间',hours:'10:00–22:00',phone:'门店电话以正式信息为准'}]
};
