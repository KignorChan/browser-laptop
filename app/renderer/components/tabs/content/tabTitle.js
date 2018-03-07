/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const {StyleSheet, css} = require('aphrodite/no-important')

// Components
const ReduxComponent = require('../../reduxComponent')

// State helpers
const titleState = require('../../../../common/state/tabContentState/titleState')
const frameStateUtil = require('../../../../../js/state/frameStateUtil')
const tabUIState = require('../../../../common/state/tabUIState')
const tabState = require('../../../../common/state/tabState')

// Utils
const platformUtil = require('../../../../common/lib/platformUtil')
const isWindows = platformUtil.isWindows()
const isDarwin = platformUtil.isDarwin()

// Styles
const globalStyles = require('../../styles/global')
const {theme} = require('../../styles/theme')

class TabTitle extends React.Component {
  mergeProps (state, ownProps) {
    const currentWindow = state.get('currentWindow')
    const tabId = ownProps.tabId
    const frameKey = frameStateUtil.getFrameKeyByTabId(currentWindow, tabId)

    const props = {}
    props.isWindows = isWindows
    props.isDarwin = isDarwin
    props.isPinned = tabState.isTabPinned(state, tabId)
    props.showTabTitle = titleState.showTabTitle(currentWindow, frameKey)
    props.displayTitle = titleState.getDisplayTitle(currentWindow, frameKey)
    props.addExtraGutter = tabUIState.addExtraGutterToTitle(currentWindow, frameKey)
    props.isTextWhite = tabUIState.checkIfTextColor(currentWindow, frameKey, 'white')
    props.tabId = tabId

    return props
  }

  render () {
    if (this.props.isPinned || !this.props.showTabTitle) {
      return null
    }
    return <div
      data-test-id='tabTitle'
      data-text={this.props.displayTitle}
      className={css(
        styles.tab__title,
        this.props.addExtraGutter && styles.tab__title_extraGutter,
        (this.props.isDarwin && this.props.isTextWhite) && styles.tab__title_isDarwin,
        // Windows specific style
        this.props.isWindows && styles.tab__title_isWindows
      )}>
      {this.props.displayTitle}
    </div>
  }
}

module.exports = ReduxComponent.connect(TabTitle)

const styles = StyleSheet.create({

  tab__title: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: 1,
    userSelect: 'none',
    fontSize: globalStyles.fontSize.tabTitle,
    lineHeight: '1',
    minWidth: 0, // see https://stackoverflow.com/a/36247448/4902448
    width: '-webkit-fill-available',
    marginLeft: '6px',
    overflow: 'hidden',
    // relative position is required for background-clip
    position: 'relative',
    zIndex: 300,
    // fade the text out by creating a background which fades to tab bg from text color
    // but clip it to the text so it doesn't interfere with any other tab background gradient.
    // Also restrict to a tiny portion of the text as background-clip: text means
    // no sub-pixel antializing (with color - zoom in 20x on mac and you'll see)
    // for that portion of text.
    color: 'transparent',
    '::before': {
      position: 'absolute',
      display: 'block',
      overflow: 'hidden',
      top: 0,
      left: 0,
      right: '18%',
      bottom: 0,
      fontWeight: 'inherit',
      content: 'attr(data-text)',
      color: 'var(--tab-color)',
      zIndex: 20,
      transition: `color var(--tab-transit-duration) var(--tab-transit-easing)`
    },
    '::after': {
      position: 'absolute',
      display: 'block',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontWeight: 'inherit',
      content: 'attr(data-text)',
      background: `linear-gradient(
        to left,
        var(--tab-background) 0,
        var(--tab-color) 18%
      ) right top / 100% 100% no-repeat`,
      WebkitBackgroundClip: 'text !important', // !important is neccessary because aphrodite will put this at top of ruleset :-(
      color: 'transparent',
      zIndex: 10,
      transition: `background 0s var(--tab-transit-easing) var(--tab-transit-duration)`
    }
  },

  tab__title_isDarwin: {
    fontWeight: '400'
  },

  tab__title_isWindows: {
    fontWeight: '500',
    fontSize: globalStyles.fontSize.tabTitle
  },

  tab__title_extraGutter: {
    margin: '0 2px'
  }
})
