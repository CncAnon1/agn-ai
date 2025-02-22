import { A, useNavigate } from '@solidjs/router'
import {
  Bot,
  Eye,
  Github,
  LogIn,
  LogOut,
  MailPlus,
  MessageCircle,
  Settings,
  Sliders,
  User,
} from 'lucide-solid'
import { Component, createMemo, JSX, Show } from 'solid-js'
import AvatarIcon from './shared/AvatarIcon'
import { inviteStore, settingStore, userStore } from './store'

const Navigation: Component = () => {
  const state = settingStore()
  const user = userStore()
  const nav = useNavigate()

  const logout = () => {
    nav('/')
    userStore.logout()
  }

  const hide = createMemo(() => (state.showMenu ? '' : 'drawer--hide'))

  return (
    <div class={`drawer flex flex-col gap-4 pt-4 ${hide()}`}>
      <div class="drawer__content flex flex-col gap-2 px-4">
        <Show when={user.loggedIn} fallback={<GuestNavigation />}>
          <UserNavigation />
        </Show>
      </div>
      <div class="flex h-16 w-full flex-col items-center justify-between border-t-2 border-[var(--bg-800)] px-4">
        <div class="mt-2 flex w-full items-center justify-between">
          <div class="flex items-center gap-4">
            <AvatarIcon avatarUrl={user.profile?.avatar} />
            <div>{user.profile?.handle}</div>
          </div>
          <div onClick={logout} class="icon-button cursor-pointer ">
            <LogOut />
          </div>
        </div>
        <div class="mb-1 text-[0.6rem] italic text-white/25">{state.config.version}</div>
      </div>
    </div>
  )
}

const UserNavigation: Component = () => {
  const user = userStore()

  return (
    <>
      <Item href="/profile">
        <User /> Profile
      </Item>

      <Item href="/character/list">
        <Bot /> Characters
      </Item>

      <Item href="/chats">
        <MessageCircle /> Chats
      </Item>

      <Item href="/invites">
        <MailPlus /> Invites <InviteBadge />
      </Item>

      <Item href="/settings">
        <Settings /> Settings
      </Item>

      <Item href="/presets">
        <Sliders /> Presets
      </Item>

      <Show when={user.user?.admin}>
        <Item href="/admin/users">
          <Eye /> Users
        </Item>
      </Show>

      <a
        class="flex h-12 items-center justify-start gap-4 rounded-xl px-2 hover:bg-[var(--bg-700)]"
        href="https://github.com/luminai-companion/agn-ai"
        target="_blank"
      >
        <Github />
        GitHub
      </a>
    </>
  )
}

const GuestNavigation: Component = () => {
  const menu = settingStore((s) => ({ showMenu: s.showMenu, config: s.config }))

  return (
    <>
      <Show when={menu.config.canAuth}>
        <Item href="/login">
          <LogIn /> Login
        </Item>
      </Show>

      <Item href="/profile">
        <User /> Profile
      </Item>

      <Item href="/character/list">
        <Bot /> Characters
      </Item>

      <Item href="/chats">
        <MessageCircle /> Chats
      </Item>

      <Item href="/settings">
        <Settings /> Settings
      </Item>

      <Item href="/presets">
        <Sliders /> Presets
      </Item>

      <a
        class="flex h-12 items-center justify-start gap-4 rounded-xl px-2 hover:bg-[var(--bg-700)]"
        href="https://github.com/luminai-companion/agn-ai"
        target="_blank"
      >
        <Github />
        GitHub
      </a>
    </>
  )
}

const Item: Component<{ href: string; children: string | JSX.Element }> = (props) => {
  return (
    <A
      href={props.href}
      class="flex h-12 items-center justify-start gap-4 rounded-xl px-2 hover:bg-[var(--bg-700)] "
      onClick={settingStore.closeMenu}
    >
      {props.children}
    </A>
  )
}

const InviteBadge: Component = () => {
  const inv = inviteStore()

  return (
    <>
      <Show when={inv.invites.length}>
        <div class="flex h-6 items-center justify-center rounded-xl bg-red-900 px-2 text-xs">
          {inv.invites.length}
        </div>
      </Show>
    </>
  )
}

export default Navigation
