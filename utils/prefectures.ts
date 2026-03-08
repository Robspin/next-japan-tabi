export type PrefectureInfo = {
  id: number
  nam: string
  nam_ja: string
  region: string
}

export const PREFECTURES: PrefectureInfo[] = [
  { id: 1,  nam: "Hokkaido",   nam_ja: "北海道", region: "hokkaido" },
  { id: 2,  nam: "Aomori",     nam_ja: "青森県", region: "tohoku" },
  { id: 3,  nam: "Iwate",      nam_ja: "岩手県", region: "tohoku" },
  { id: 4,  nam: "Miyagi",     nam_ja: "宮城県", region: "tohoku" },
  { id: 5,  nam: "Akita",      nam_ja: "秋田県", region: "tohoku" },
  { id: 6,  nam: "Yamagata",   nam_ja: "山形県", region: "tohoku" },
  { id: 7,  nam: "Fukushima",  nam_ja: "福島県", region: "tohoku" },
  { id: 8,  nam: "Ibaraki",    nam_ja: "茨城県", region: "kanto" },
  { id: 9,  nam: "Tochigi",    nam_ja: "栃木県", region: "kanto" },
  { id: 10, nam: "Gunma",      nam_ja: "群馬県", region: "kanto" },
  { id: 11, nam: "Saitama",    nam_ja: "埼玉県", region: "kanto" },
  { id: 12, nam: "Chiba",      nam_ja: "千葉県", region: "kanto" },
  { id: 13, nam: "Tokyo",      nam_ja: "東京都", region: "kanto" },
  { id: 14, nam: "Kanagawa",   nam_ja: "神奈川県", region: "kanto" },
  { id: 15, nam: "Niigata",    nam_ja: "新潟県", region: "chubu" },
  { id: 16, nam: "Toyama",     nam_ja: "富山県", region: "chubu" },
  { id: 17, nam: "Ishikawa",   nam_ja: "石川県", region: "chubu" },
  { id: 18, nam: "Fukui",      nam_ja: "福井県", region: "chubu" },
  { id: 19, nam: "Yamanashi",  nam_ja: "山梨県", region: "chubu" },
  { id: 20, nam: "Nagano",     nam_ja: "長野県", region: "chubu" },
  { id: 21, nam: "Gifu",       nam_ja: "岐阜県", region: "chubu" },
  { id: 22, nam: "Shizuoka",   nam_ja: "静岡県", region: "chubu" },
  { id: 23, nam: "Aichi",      nam_ja: "愛知県", region: "chubu" },
  { id: 24, nam: "Mie",        nam_ja: "三重県", region: "kansai" },
  { id: 25, nam: "Shiga",      nam_ja: "滋賀県", region: "kansai" },
  { id: 26, nam: "Kyoto",      nam_ja: "京都府", region: "kansai" },
  { id: 27, nam: "Osaka",      nam_ja: "大阪府", region: "kansai" },
  { id: 28, nam: "Hyogo",      nam_ja: "兵庫県", region: "kansai" },
  { id: 29, nam: "Nara",       nam_ja: "奈良県", region: "kansai" },
  { id: 30, nam: "Wakayama",   nam_ja: "和歌山県", region: "kansai" },
  { id: 31, nam: "Tottori",    nam_ja: "鳥取県", region: "chugoku" },
  { id: 32, nam: "Shimane",    nam_ja: "島根県", region: "chugoku" },
  { id: 33, nam: "Okayama",    nam_ja: "岡山県", region: "chugoku" },
  { id: 34, nam: "Hiroshima",  nam_ja: "広島県", region: "chugoku" },
  { id: 35, nam: "Yamaguchi",  nam_ja: "山口県", region: "chugoku" },
  { id: 36, nam: "Tokushima",  nam_ja: "徳島県", region: "shikoku" },
  { id: 37, nam: "Kagawa",     nam_ja: "香川県", region: "shikoku" },
  { id: 38, nam: "Ehime",      nam_ja: "愛媛県", region: "shikoku" },
  { id: 39, nam: "Kochi",      nam_ja: "高知県", region: "shikoku" },
  { id: 40, nam: "Fukuoka",    nam_ja: "福岡県", region: "kyushu" },
  { id: 41, nam: "Saga",       nam_ja: "佐賀県", region: "kyushu" },
  { id: 42, nam: "Nagasaki",   nam_ja: "長崎県", region: "kyushu" },
  { id: 43, nam: "Kumamoto",   nam_ja: "熊本県", region: "kyushu" },
  { id: 44, nam: "Oita",       nam_ja: "大分県", region: "kyushu" },
  { id: 45, nam: "Miyazaki",   nam_ja: "宮崎県", region: "kyushu" },
  { id: 46, nam: "Kagoshima",  nam_ja: "鹿児島県", region: "kyushu" },
  { id: 47, nam: "Okinawa",    nam_ja: "沖縄県", region: "kyushu" },
]

export const PREFECTURE_BY_ID: Record<number, PrefectureInfo> = Object.fromEntries(
  PREFECTURES.map((p) => [p.id, p])
)
