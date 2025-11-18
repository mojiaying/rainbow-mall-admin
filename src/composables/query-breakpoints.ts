export const breakpointsEnum = {
  xl: 1600,
  lg: 1199,
  md: 991,
  sm: 767,
  xs: 575,
}

export function useQueryBreakpoints() {
  const breakpoints = reactive(useBreakpoints(breakpointsEnum))

  // 手机端
  const isMobile = breakpoints.smaller('sm')
  // pad端
  const isPad = breakpoints.between('sm', 'lg')
  // pc端
  const isDesktop = breakpoints.greater('md')
  const isLgDesktop = breakpoints.greater('xl')

  return {
    breakpoints,
    isMobile,
    isPad,
    isDesktop,
    isLgDesktop
  }
}
