import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { defaultTabBinding } from '@codemirror/commands';
import { EditorView, keymap } from '@codemirror/view';
import { json } from '@codemirror/lang-json';

function editorSetup() {
    const jsonRequestBody = document.querySelector('[data-json-request-body]');
    const jsonResponseBody = document.querySelector('[data-json-response-body]');

    const extensions = [
        basicSetup,
        keymap.of([defaultTabBinding]),
        EditorState.tabSize.of(2),
        json(),
    ];

    const requestEditor = new EditorView({
        state: EditorState.create({
            doc: '{\n\t\n}',
            extensions,
        }),
        parent: jsonRequestBody,
    });
    const responseEditor = new EditorView({
        state: EditorState.create({
            doc: '{}',
            extensions: [...extensions, EditorView.editable.of(false)],
        }),
        parent: jsonResponseBody,
    });

    function updateResponseEditor(value) {
        responseEditor.dispatch({
            changes: {
                from: 0,
                to: responseEditor.state.doc.length,
                insert: JSON.stringify(value, null, 2),
            },
        });
    }    

    return {
        requestEditor,
        updateResponseEditor,
    };
}

export default editorSetup;
