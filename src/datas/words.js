import axios from 'axios'

export function getWords(classId, courseId) {
  let url = '/api/word'

  let data = Object.assign({}, {
    action: 'exam',
    type: 'recall',
    word_ids: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19',
    class_id: classId,
    course: courseId,
    mode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}