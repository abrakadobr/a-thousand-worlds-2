import dayjs from 'dayjs'
import iam from '@/util/iam'
import can from '@/util/can'
import store from '@/store'

const withState = f => (...args) => f(store.state, ...args)

const mixins = {
  methods: {
    $can: withState(can),
    $iam: withState(iam),
    $dateFormat(date) {
      const d = dayjs(date)
      return d.format('D MMM YY')
    }
  },
  computed: {
    $uiBusy() {
      return this.$store.state.ui.busy
    }
  }
}

export default mixins
