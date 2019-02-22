import ABC from '~/static/img/bank/ABC@3x.png'
import BOB from '~/static/img/bank/BOB@3x.png'
import BOC from '~/static/img/bank/bank_logo_bank@3x.png'
import BOS from '~/static/img/bank/BOS@3x.png'
import CCB from '~/static/img/bank/CCB@3x.png'
import CEB from '~/static/img/bank/CEB@3x.png'
import CIB from '~/static/img/bank/CIBC@3x.png'
import CITIC from '~/static/img/bank/CITIC@3x.png'
import CMB from '~/static/img/bank/CMB@3x.png'
import HXB from '~/static/img/bank/HXB@3x.png'
import ICBC from '~/static/img/bank/ICBC@3x.png'
import PSBC from '~/static/img/bank/PSBC@3x.png'
import COMM from '~/static/img/bank/COMM@3x.png'
import GDB from '~/static/img/bank/GDB@3x.png'
import SPDB from '~/static/img/bank/SPDB@3x.png'
import SZPAB from '~/static/img/bank/SZPAB@3x.png'

import ABCPARA from '~/static/img/bank_para/ABC@3x.png'
import BOBPARA from '~/static/img/bank_para/BOB@3x.png'
import BOCPARA from '~/static/img/bank_para/BOC2B@3x.png'
import BOSPARA from '~/static/img/bank_para/BOS@3x.png'
import CCBPARA from '~/static/img/bank_para/CCB@3x.png'
import CEBPARA from '~/static/img/bank_para/CEB@3x.png'
import CIBPARA from '~/static/img/bank_para/CIBC@3x.png'
import CITICPARA from '~/static/img/bank_para/CITIC@3x.png'
import CMBPARA from '~/static/img/bank_para/CMB@3x.png'
import HXBPARA from '~/static/img/bank_para/HXB@3x.png'
import ICBCPARA from '~/static/img/bank_para/ICBC@3x.png'
import PSBCPARA from '~/static/img/bank_para/PSBC@3x.png'
import COMMPARA from '~/static/img/bank_para/CIB@3x.png'
import GDBPARA from '~/static/img/bank_para/CGB@3x.png'
import SPDBPARA from '~/static/img/bank_para/SPDB@3x.png'
import SZPABPARA from '~/static/img/bank_para/PAB@3x.png'
import CQRCBPARA from '~/static/img/bank_para/CQRCB@3x.png'

export const evaluateList = [
  {
    title: '您的年龄介于？',
    content: [
      '65岁以上',
      '18-30岁',
      '31-45岁',
      '46-65岁'
    ]
  },
  {
    title: '您的学历为？',
    content: [
      '高中及以下',
      '中专或大专',
      '本科',
      '硕士及以上'
    ]
  },
  {
    title: '您的职业为？',
    content: [
      '无固定职业',
      '一般企事业单位员工',
      '专业技术人员',
      '金融行业一般从业人员'
    ]
  },
  {
    title: '您的家庭可支配年收入是多少？',
    content: [
      '20万元以下',
      '20万元至50万元',
      '50万元至150万元',
      '150万元以上'
    ]
  },
  {
    title: '您个人目前已经或者准备投资的金额占您或者家庭所拥有总资产（包括存款、证券投资、房地产及实业等）的比重是多少？',
    content: [
      '80-100%',
      '50-80%',
      '20-50%',
      '0-20%'
    ]
  },
  {
    title: '您的投资经验可描述为？',
    content: [
      '除银行储蓄外，基本没有其他投资经验',
      '购买过债券、保险等理财产品',
      '参与过股票、基金等产品的交易',
      '参与过权证、期货、期权等产品的交易'
    ]
  },
  {
    title: '您有多少年投资基金、股票、信托、私募证券或金融衍生产品等风险投资品的经验？',
    content: [
      '没有',
      '有，但是少于1年',
      '有，在1-5年之间',
      '有，长于5年'
    ]
  },
  {
    title: '您投资投资基金、信托、私募证券或金融衍生产品等产品主要用于什么目的？',
    content: [
      '平时生活保障，赚点补贴家用',
      '养老、子女教育等家庭支出',
      '资产增值',
      '家庭富裕'
    ]
  },
  {
    title: '您的家人或朋友认为您在投资中是什么样的风险承担者？',
    content: [
      '无法承受风险',
      '虽然厌恶风险但愿意承担一些风险',
      '在深思熟虑后愿意承担一定的风险',
      '敢冒风险，比较激进'
    ]
  },
  {
    title: '您认为自己能承受的最大投资收益损失是多少？',
    content: [
      '10%以内',
      '10%-30% ',
      '30%-50%',
      '超过50%'
    ]
  }
]

// 获取银行卡头像
export function getBankImg (bankType) {
  switch (bankType) {
    case 'ABC':
      return ABC
    case 'BOB':
      return BOB
    case 'BOC':
      return BOC
    case 'BOS':
      return BOS
    case 'CCB':
      return CCB
    case 'CEB':
      return CEB
    case 'CIB':
      return CIB
    case 'CITIC':
      return CITIC
    case 'CMB':
      return CMB
    case 'HXB':
      return HXB
    case 'ICBC':
      return ICBC
    case 'PSBC':
      return PSBC
    case 'COMM':
      return COMM
    case 'GDB':
      return GDB
    case 'SPDB':
      return SPDB
    case 'SZPAB':
      return SZPAB
    default:
      return ''
  }
}
// 获取绑定银行卡头像，带有文字
export function getBankParaImg (bankType) {
  switch (bankType) {
    case 'ABC':
      return [ABCPARA, '#019959']
    case 'BOB':
      return [BOBPARA, '#ce242b']
    case 'BOC':
      return [BOCPARA, '#ce242b']
    case 'BOS':
      return [BOSPARA, '#183885']
    case 'CCB':
      return [CCBPARA, '#183885']
    case 'CEB':
      return [CEBPARA, '#50267c']
    case 'CIB':
      return [CIBPARA, '#183885']
    case 'CITIC':
      return [CITICPARA, '#ce242b']
    case 'CMB':
      return [CMBPARA, '#ce242b']
    case 'HXB':
      return [HXBPARA, '#ce242b']
    case 'ICBC':
      return [ICBCPARA, '#ce242b']
    case 'PSBC':
      return [PSBCPARA, '#019959']
    case 'COMM':
      return [COMMPARA, '#183885']
    case 'GDB':
      return [GDBPARA, '#ce242b']
    case 'SPDB':
      return [SPDBPARA, '#183885']
    case 'SZPAB':
      return [SZPABPARA, '#f15a22']
    case 'CQRCB':
      return [CQRCBPARA, '#ce242b']
    default:
      return ''
  }
}
