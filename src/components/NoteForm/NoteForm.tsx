import { useId } from 'react';
import css from './NoteForm.module.css';
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';

interface FormValues {
    title: string;
    content: string;
    tag: string;
}

interface NoteFormProps {
    onClose: () => void;
    onSuccess: () => void;
}


const NoteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters!")
        .max(50, "Title is too long!")
        .required("Title is required!"),
    content: Yup.string()
        .max(500, "Too long!"),
    tag: Yup.string()
        .required("Choose your notetag!")
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"] as const)
})

export default function NoteForm({onClose, onSuccess}: NoteFormProps) {
    const fieldId = useId();

    const initialValues: FormValues = {
        title: '',
        content: '',
        tag: 'Todo',
    };

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createNote,
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onSuccess();
        }
    })

    const handleFormSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
        mutate({
            title: values.title,
            content: values.content,
            tag: values.tag
        });
        actions.resetForm();
    }
    
    return (
        <Formik initialValues={initialValues} validationSchema={NoteFormSchema} onSubmit={handleFormSubmit}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-title`}>Title</label>
                    <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-content`}>Content</label>
                    <Field
                        as="textarea"
                        id={`${fieldId}-content`}
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-tag`}>Tag</label>
                    <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>
                <div className={css.actions}>
                    <button type="button" className={css.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={false}
                    >
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    );
}