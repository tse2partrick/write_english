const style = document.createElement('div').style
const vendor = (function() {
  let transNames = {
    webkit: 'webkitTransform',
    moz: 'mozTransform',
    o: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let i in transNames) {
    if (style[transNames[i]] !== undefined) {
      return i
    }
  }

  return false
})()

export function prefixStyle(styleName) {
  if (!vendor) {
    console.log('浏览器不支持' + styleName + '属性')
  }

  if (vendor === 'standard') {
    return styleName
  }

  return vendor + styleName[0].toUpperCase() + styleName.slice(1)
}

export function shuffle(arr) {
  let ret = arr.slice()
  ret.sort(() => {
    return Math.random() > 0.5 ? 1 : -1
  })

  return ret
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let cls = el.className + ' ' + className
  el.className = cls
}

export function removeClass(el, className) {
  if (!hasClass(el, className)) {
    return
  }

  let cls = el.className.split(' ')
  let index = cls.findIndex((i) => {
    return i === className
  })

  cls.splice(index, 1)

  el.className = cls.join(' ')
}

export function hasClass(el, className) {
  if (el.className.indexOf(className) !== -1) {
    return true
  }

  return false
}