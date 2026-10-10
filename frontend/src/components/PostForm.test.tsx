
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import PostForm from './PostForm'

describe('PostForm - P2', () => {
    test('envía correctamente los datos de un thread', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()

        render(<PostForm onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Name (Optional)'), 'Maira')
        await user.type(screen.getByRole('textbox', { name: /Comment/i }), 'Mi primer thread')
        await user.click(screen.getByRole('button', { name: 'Post' }))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit).toHaveBeenCalledWith({
            content: 'Mi primer thread',
            author: 'Maira',
            parent: undefined,
        })
    })

    test('envía un comentario con su parent', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()

        render(<PostForm onSubmit={onSubmit} parentId={5} />)

        await user.type(screen.getByLabelText('Name (Optional)'), 'Maira')
        await user.type(screen.getByRole('textbox', { name: /Comment/i }), 'Mi respuesta')
        await user.click(screen.getByRole('button', { name: 'Post' }))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit).toHaveBeenCalledWith({
            content: 'Mi respuesta',
            author: 'Maira',
            parent: 5,
        })
    })
})
