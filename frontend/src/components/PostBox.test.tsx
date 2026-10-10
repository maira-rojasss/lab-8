
import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import PostBox from './PostBox'
import type { Post } from '../types/posts'
import userEvent from '@testing-library/user-event'

vi.mock('../services/threads', () => ({
    default: {
        update: vi.fn(),
    },
}))


// Publicación de ejemplo para los tests.
const post: Post = {
    id: 1,
    content: 'Este es un comentario de prueba',
    author: 'Maira',
    thread: 10,
    parent: null,
    createdAt: '2026-10-06T12:00:00.000Z',
    updatedAt: '2026-10-06T12:00:00.000Z',
    likes: 0,
    dislikes: 0,
}

// Renderizamos el componente dentro de un Router
// porque PostBox utiliza Link y useNavigate.
const renderPost = (comment: Post) => {
    render(
        <MemoryRouter>
            <PostBox
                post={comment}
                action="reply"
                setToast={vi.fn()}
            />
        </MemoryRouter>
    )
}

describe('PostBox - P1', () => {
    test('muestra el contenido y el autor', () => {
        renderPost(post)

        expect(
            screen.getByText('Este es un comentario de prueba')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Maira')
        ).toBeInTheDocument()
    })

    test('muestra Anonymous cuando no hay autor', () => {
        renderPost({ ...post, author: null })

        expect(
            screen.getByText('Anonymous')
        ).toBeInTheDocument()
    })

    test('muestra el ID del comentario padre', () => {
        renderPost({ ...post, parent: 5 })

        expect(
            screen.getByRole('link', { name: />>\s*5/ })
        ).toHaveAttribute('href', '/#5')
    })


    test('llama dos veces a setToast al presionar like dos veces', async () => {
        const setToast = vi.fn()
        const user = userEvent.setup()

        const { default: threads } = await import('../services/threads')
        vi.mocked(threads.update).mockResolvedValue(post)

        render(
            <MemoryRouter>
                <PostBox
                    post={post}
                    action="reply"
                    setToast={setToast}
                />
            </MemoryRouter>
        )

        const likeButton = screen.getByRole('button', { name: 'like post' })

        await user.click(likeButton)
        await user.click(likeButton)

        await vi.waitFor(() => {
            expect(setToast).toHaveBeenCalledTimes(2)
        })
    })

})
