import request from '@/utils/request'

export function delFile(url) {
  return request({
    url: `tools/delFile?url=${url}`,
    method: 'delete'
  })
}
