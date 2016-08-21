import {MouseHooker} from './mousehooker';

const target = document.getElementById('c');

const hooker = new MouseHooker(target);

function log(message: string) {
    const $log = $('#log');

    const $item = $('<li></li>');
    $item.text(message);

    $log.prepend($item);
}

function updateState(state) {
    $('#mousePos').text(`{ x: ${state.x}, y: ${state.y} }`);
    $('#mouseButton').text(state.button == null ? '' : state.button);
    $('#mouseInsideTarget').text(state.withinElement);
}

hooker.on('mousedown', event => {
    log('mousedown');
    updateState(event);
});

hooker.on('mousemove', event => {
    log('mousemove');
    updateState(event);
});

hooker.on('mouseup', event => {
    log('mouseup');
    updateState({
        x: event.x,
        y: event.y,
        button: null,
        withinElement: event.withinElement
    });
});
