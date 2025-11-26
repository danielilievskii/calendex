import {
    CalendarIcon,
    QueueListIcon,
    DocumentTextIcon,
    QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

export const sidebarItems = [
    { to: '/', label: 'Calendar', icon: CalendarIcon },
    { to: '/agenda', label: 'Agenda', icon: QueueListIcon },
    { to: '/guides', label: 'Guides', icon: DocumentTextIcon },
    { to: '/faq', label: 'FAQ', icon: QuestionMarkCircleIcon }
]
