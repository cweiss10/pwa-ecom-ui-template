import MenuIcon from '@material-design-icons/svg/outlined/menu.svg'
import { useUpdateAtom } from 'jotai/utils'
import { useRouter } from 'next/dist/client/router'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

import { AutocompleteBasic } from '@autocomplete/basic/autocomplete-basic'
import { AutocompleteInstantSearch } from '@autocomplete/instantsearch/autocomplete-instantsearch'
import { Button } from '@ui/button/button'
import { IconLabel } from '@ui/icon-label/icon-label'

import { NavItem } from './nav-item'

import { overlayAtom } from '@/components/overlay/overlay'
import { useClassNames } from '@/hooks/useClassNames'
import { useSearchContext } from '@/hooks/useSearchContext'
import { Laptop, Tablet } from '@/lib/media'

export const NavBottom = memo(function NavBottom() {
  const router = useRouter()
  const isHomePage = useMemo(() => router?.pathname === '/', [router])

  // Autocomplete placeholders
  const { current: placeholders } = useRef(['products', 'articles', 'faq'])

  // Autocomplete expand on focus
  const { query: initialQuery } = useSearchContext()
  const [isFocused, setIsFocused] = useState(false)
  const setOverlay = useUpdateAtom(overlayAtom)

  useEffect(() => {
    setIsFocused(Boolean(initialQuery))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onFocusBlur = (focused: boolean, hasQuery: boolean) => {
    setIsFocused(hasQuery ? true : focused)
    if (isHomePage) setOverlay({ visible: focused, zIndex: 'z-overlay-header' })
  }

  const autocompleteCn = useClassNames(
    'w-full pl-2.5 laptop:w-80 laptop:p-0 laptop:transition-width laptop:ease-out laptop:absolute laptop:right-0',
    { 'focused laptop:w-11/12': isFocused },
    [isFocused]
  )

  // Autocomplete implementation\
  const Autocomplete = useMemo(
    () => (isHomePage ? AutocompleteBasic : AutocompleteInstantSearch),
    [isHomePage]
  )

  // Render
  return (
    <div className="flex items-center px-4 relative divide-x border-b border-neutral-light laptop:h-12 laptop:mx-20 laptop:mb-5 laptop:px-0 laptop:justify-between laptop:border-none laptop:divide-none">
      <Tablet>
        <Button className="p-3 pl-0">
          <IconLabel icon={MenuIcon} label="Menu" labelPosition="right" />
        </Button>
      </Tablet>

      <Laptop>
        <nav>
          <ul className="flex gap-6 small-uppercase">
            <NavItem label="Sale" />
            <NavItem label="New In" href="/new-in" />
            <NavItem label="Clothing" />
            <NavItem label="Shoes" />
            <NavItem label="Accessories" />
            <NavItem label="Brands" />
          </ul>
        </nav>
      </Laptop>

      <div className={autocompleteCn}>
        <div className="hidden absolute w-24 h-full -translate-x-full bg-gradient-to-l from-white laptop:block" />
        <Autocomplete placeholders={placeholders} onFocusBlur={onFocusBlur} />
      </div>
    </div>
  )
})
