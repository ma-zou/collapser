

/**
 * @name Collapser
 * @author Malte Zoudlik
 * @version 1.0.1
 * @copyright (c) 2018
 */
function Collapser(args) {
    this.params = {
        trigger: '.collapser',
        maxHeight: false,
        scrollTo: false,
        openFirst: true,
        onhold: false
    };
    var instance = {};

    var merge_options = function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    };

    instance.params = merge_options(this.params, args);
    instance.status = false;

    var scrollFunction = function (elem, duration, view) {
        if (view === "top") view = 0;
        else if (view === "bottom") view = window.innerHeight;
        else if (view === "center") view = window.innerHeight / 2;

        setTimeout(function () {

            var steps = (elem.getBoundingClientRect().top - window.pageXOffset - view) / (duration / 15),
                currentTime = 0,
                animateScroll = function () {
                    currentTime += 15;
                    var val = steps;

                    document.documentElement.scrollTop += val;
                    if (currentTime < duration) setTimeout(animateScroll, 15);
                };
            animateScroll();
        }, 300);
    }

    var updateStatus = function (elem, type, init) {
        if (type) {
            var activeHeight = elem.nextElementSibling.scrollHeight + 'px';

            elem.classList.add('active');
            if (instance.params.maxHeight != false && instance.params.maxHeight <= elem.nextElementSibling.scrollHeight) {
                elem.nextElementSibling.classList.add('limited');
                activeHeight = instance.params.maxHeight + 'px';
            }
            elem.nextElementSibling.style.maxHeight = activeHeight;
            observeHeight(elem.nextElementSibling, true);
            if (typeof init == "undefined" && instance.params.scrollTo === true) scrollFunction(elem, 500, 100);
        } else {
            elem.classList.remove('active');
            elem.nextElementSibling.classList.remove('limited');
            observeHeight(elem.nextElementSibling, false);
            elem.nextElementSibling.style.maxHeight = 0;
        }
    }

    var updateHeight = function (e) {
        var activeHeight = e.target.resizeObserver.scrollHeight + 'px';
        if (instance.params.maxHeight != false && instance.params.maxHeight <= e.target.resizeObserver.scrollHeight) {
            e.target.resizeObserver.classList.add('limited');
            activeHeight = instance.params.maxHeight + 'px';
        } else {
            e.target.resizeObserver.classList.remove('limited');
        }
        e.target.resizeObserver.style.maxHeight = activeHeight;
    }

    var observeHeight = function (elem, type) {
        if (type) {
            window.addEventListener('resize', updateHeight);
            window.resizeObserver = elem;
        } else {
            window.removeEventListener('resize', updateHeight);
        }
    }

    var openDesignated = function (linked, triggerList) {

        [].forEach.call(triggerList, function (trigger) {
            updateStatus(trigger, false);
            if (trigger.id == linked.replace('#', '')) {
                updateStatus(trigger, true);
                scrollFunction(trigger, 500, 100);
            }
        });
    }

    var handleClick = function (e) {
        if (e.currentTarget.classList.contains('active')) {
            updateStatus(e.currentTarget, false);
        } else {
            [].forEach.call(e.currentTarget.triggerList, function (trigger) { updateStatus(trigger, false); });
            updateStatus(e.currentTarget, true);
        }
    }

    var init = function () {
        instance.triggerList = document.querySelectorAll(instance.params.trigger);

        [].forEach.call(instance.triggerList, function (trigger) {
            trigger.addEventListener('click', handleClick);
            trigger.classList.add('collapser-initialized');
            trigger.triggerList = instance.triggerList;
            trigger.nextElementSibling.style.maxHeight = 0;
        });

        if (window.location.hash.indexOf('#') == -1 || window.location.hash.length <= 1) updateStatus(instance.triggerList[0], instance.params.openFirst, false);
        else openDesignated(window.location.hash, instance.triggerList);

        instance.status = true;
        return instance.triggerList;
    }

    var destroy = function () {
        instance.triggerList = document.querySelectorAll(instance.params.trigger);
        [].forEach.call(instance.triggerList, function (trigger) {
            trigger.removeEventListener('click', handleClick);
            trigger.classList.remove('collapser-initialized');
            trigger.nextElementSibling.style.maxHeight = '100%';
        });
        instance.status = false;
    }

    if (instance.params.onhold === false) {
        init();
    }

    this.init = function () {
        if (instance.status === false) init();
    }

    this.destroy = function () {
        if (instance.status && instance.params.onhold) destroy();
    }

    this.params = instance.params;

    return this
}